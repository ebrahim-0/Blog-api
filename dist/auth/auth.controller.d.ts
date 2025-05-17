import { AuthService } from './auth.service';
import { Request } from 'express';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto, LoginUserDto } from '@/users/dto/create-user.dto';
export declare class AuthController {
    private _AuthService;
    constructor(_AuthService: AuthService);
    register(user: CreateUserDto): Promise<{
        message: string;
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
        accessToken: string;
        refreshToken: string;
    }>;
    login(user: LoginUserDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isRestToken: boolean | null;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(req: Request): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(body: forgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(userId: string, token: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    checkResetToken(body: {
        token: string;
    }): Promise<{
        message: string;
    }>;
}
