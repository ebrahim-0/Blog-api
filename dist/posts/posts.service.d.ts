import { PrismaService } from '@/prisma/prisma.service';
import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostModel } from '@prisma/client';
import { AllPostsRes } from '@/interfaces/post';
export declare class PostsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(req: Request, user: CreatePostDto): Promise<PostModel>;
    findAll(req: Request): Promise<AllPostsRes>;
    findOne(id: string): Promise<PostModel>;
    update(req: Request, id: string, updateUserDto: UpdatePostDto): Promise<PostModel>;
    remove(req: Request, id: string): Promise<{
        message: string;
    }>;
}
