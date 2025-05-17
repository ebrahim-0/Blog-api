import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { Post as PostModel } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { AllUsersRes, IUser } from '@/interfaces/user';
export declare class UsersService {
    private readonly prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    createUser(req: Request, user: CreateUserDto): Promise<{
        token: string;
        user: IUser;
    }>;
    findAll(req: Request): Promise<AllUsersRes>;
    findOne(id: string): Promise<IUser>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<IUser>;
    remove(id: string): Promise<{
        message: string;
    }>;
    userPosts(id: string): Promise<PostModel[]>;
    userPost(id: string, postId: string): Promise<PostModel>;
}
