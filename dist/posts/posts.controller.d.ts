import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import { Post as PostModel } from '@prisma/client';
import { AllPostsRes } from '@/interfaces/post';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(req: Request, user: CreatePostDto): Promise<{
        message: string;
        post: PostModel;
    }>;
    findAll(req: Request): Promise<AllPostsRes>;
    findOne(id: string): Promise<PostModel>;
    update(req: Request, id: string, updatePostDto: UpdatePostDto): Promise<{
        message: string;
        post: PostModel;
    }>;
    remove(req: Request, id: string): Promise<{
        message: string;
    }>;
}
