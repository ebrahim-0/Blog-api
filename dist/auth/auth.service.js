"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const Role_enum_1 = require("../enum/Role-enum");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
let AuthService = class AuthService {
    constructor(prisma, jwtService, _MailerService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this._MailerService = _MailerService;
    }
    async createUser(user) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: user.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        const createdUser = await this.prisma.user.create({
            data: {
                ...user,
                role: Role_enum_1.Role.user,
            },
        });
        const { password, ...userWithoutPassword } = createdUser;
        const accessToken = this.jwtService.sign(userWithoutPassword, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d',
        });
        const refreshToken = this.jwtService.sign(userWithoutPassword, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '30d',
        });
        await this.prisma.user.update({
            where: { id: createdUser.id },
            data: { refreshToken },
        });
        return { accessToken, refreshToken, user: userWithoutPassword };
    }
    async login(user) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: user.email },
        });
        if (!existingUser) {
            throw new common_1.BadRequestException('User with this email does not exist');
        }
        const isValidPassword = await bcrypt.compare(user.password, existingUser.password);
        if (!isValidPassword) {
            throw new common_1.BadRequestException('Invalid password');
        }
        const { password, refreshToken, ...userWithoutPassword } = existingUser;
        const accessToken = this.jwtService.sign(userWithoutPassword, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d',
        });
        const newRefreshToken = this.jwtService.sign(userWithoutPassword, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '30d',
        });
        await this.prisma.user.update({
            where: { id: existingUser.id },
            data: { refreshToken: newRefreshToken },
        });
        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: userWithoutPassword,
        };
    }
    async refreshToken(refreshToken) {
        const user = await this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
        });
        const { iat, exp, ...userWithoutExp } = user;
        const accessToken = this.jwtService.sign(userWithoutExp, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d',
        });
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const email = forgotPasswordDto.email;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException("User Doesn't Exist");
        }
        const payload = { id: user.id, email, resetToken: true };
        await this.prisma.user.update({
            where: { id: user.id },
            data: { isRestToken: false },
        });
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_RESET_SECRET,
            expiresIn: '10m',
        });
        const baseURL = process.env.NODE_ENV === 'development'
            ? process.env.BASE_URL_Local
            : process.env.BASE_URL_SERVER;
        const link = `${baseURL}/reset-password?userId=${user.id}&token=${token}`;
        const sendMail = await this._MailerService.sendMail({
            from: `Blog App <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: 'Reset Password',
            text: 'Reset Password',
            html: `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 24px; color: #333;">Reset Your Password</h1>
        </div>
        <div style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${link}" style="display: inline-block; padding: 15px 20px; font-size: 16px; color: #fff !important; background-color: #007bff; text-decoration: none; border-radius: 5px; text-align: center; margin: 20px 0;">Reset Password</a>
            <p>If you didn’t request a password reset, please ignore this email. Your password will not be changed.</p>
        </div>
        <div style="text-align: center; font-size: 14px; color: #999;">
            <p>Thank you,<br>The Your Company Team</p>
            <p><a href="${baseURL}" style="color: #007bff; text-decoration: none;">Visit our website</a></p>
        </div>
    </div>
</body>
</html>
`,
        });
        console.log('Email Sent Successfully check your email');
        if (!sendMail) {
            throw new common_1.BadRequestException('Email Not Sent');
        }
        return {
            message: 'Email Sent Successfully check your email',
        };
    }
    async resetPassword(userId, token, resetPasswordDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.NotFoundException("User Doesn't Exist");
            }
            if (user.isRestToken) {
                throw new common_1.BadRequestException('Invalid or already used token');
            }
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_RESET_SECRET,
            });
            if (user.id !== payload.id) {
                throw new common_1.BadRequestException('Invalid Token');
            }
            if (!payload.resetToken) {
                throw new common_1.BadRequestException('Invalid Token');
            }
            const hashedPassword = await bcrypt.hash(resetPasswordDto.new_password, 10);
            await this.prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword, isRestToken: true },
            });
            return {
                message: 'Password Reset Successfully',
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('token is invalid or expired');
        }
    }
    async checkResetToken(token) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_RESET_SECRET,
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.id },
            });
            if (!user) {
                throw new common_1.NotFoundException("User Doesn't Exist");
            }
            if (user.isRestToken) {
                throw new common_1.ForbiddenException('Invalid or already used token');
            }
            return {
                message: 'Token is valid',
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map