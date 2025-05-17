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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const create_user_dto_1 = require("../users/dto/create-user.dto");
let AuthController = class AuthController {
    constructor(_AuthService) {
        this._AuthService = _AuthService;
    }
    async register(user) {
        const newUser = await this._AuthService.createUser(user);
        return {
            message: 'User created successfully',
            user: newUser.user,
            accessToken: newUser.accessToken,
            refreshToken: newUser.refreshToken,
        };
    }
    async login(user) {
        const existingUser = await this._AuthService.login(user);
        return {
            message: 'User logged in successfully',
            user: existingUser.user,
            accessToken: existingUser.accessToken,
            refreshToken: existingUser.refreshToken,
        };
    }
    async refreshToken(req) {
        const refreshToken = req.headers['x-refresh-token'];
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is required');
        }
        const tokenString = Array.isArray(refreshToken)
            ? refreshToken[0]
            : refreshToken;
        try {
            const { user, accessToken, refreshToken } = await this._AuthService.refreshToken(tokenString);
            return {
                user,
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async forgotPassword(body) {
        try {
            return await this._AuthService.forgotPassword(body);
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async resetPassword(userId, token, resetPasswordDto) {
        try {
            return await this._AuthService.resetPassword(userId, token, resetPasswordDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async checkResetToken(body) {
        try {
            return await this._AuthService.checkResetToken(body.token);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiBody)({
        type: create_user_dto_1.CreateUserDto,
        description: 'Details of the user to be registered',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login an existing user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged in successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiBody)({
        type: create_user_dto_1.LoginUserDto,
        description: 'Details of the user to be logged in',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.forgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password/:userId/:token'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('token')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('check-reset-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkResetToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map