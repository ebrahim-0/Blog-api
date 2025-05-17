import { Post as PostModel } from '@prisma/client';
import { Request } from 'express';
import { AllUsersRes, IUser, UserRes } from '@/interfaces/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(req: Request, user: CreateUserDto): Promise<UserRes>;
    findAll(req: Request): Promise<AllUsersRes>;
    findOne(id: string): Promise<IUser>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        user: IUser;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    userPosts(id: string): Promise<PostModel[]>;
    userPost(id: string, postId: string): Promise<PostModel>;
}
