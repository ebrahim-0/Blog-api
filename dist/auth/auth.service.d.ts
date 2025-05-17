import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from '@/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private readonly prisma;
    private jwtService;
    private readonly _MailerService;
    constructor(prisma: PrismaService, jwtService: JwtService, _MailerService: MailerService);
    createUser(user: CreateUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isRestToken: boolean | null;
            refreshToken: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(user: LoginUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isRestToken: boolean | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(forgotPasswordDto: forgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(userId: string, token: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    checkResetToken(token: string): Promise<{
        message: string;
    }>;
}
