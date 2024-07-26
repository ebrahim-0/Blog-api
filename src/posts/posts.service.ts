import { Injectable, NotFoundException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostModel } from '@prisma/client';
import { AllPostsRes } from 'src/interfaces/post';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(req: Request, user: CreatePostDto): Promise<PostModel> {
    const newPost = await this.prisma.post.create({
      data: {
        title: user.title,
        content: user.content,
        authorId: req['user'].id,
      },
    });

    return newPost;
  }

  async findAll(req: Request): Promise<AllPostsRes> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await this.prisma.post.count();

    const posts = await this.prisma.post.findMany({
      skip,
      take: limit,
    });

    const hasMore = skip + posts.length < totalItems;

    const totalPages = Math.ceil(totalItems / limit);

    return {
      posts,
      currentPage: page,
      perPage: limit,
      totalPages,
      totalItems,
      hasMore,
    };
  }

  async findOne(id: number): Promise<PostModel> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    return post;
  }

  async update(
    req: Request,
    id: number,
    updateUserDto: UpdatePostDto,
  ): Promise<PostModel> {
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    const userPost = await this.prisma.post.findMany({
      where: { authorId: req['user'].id },
    });

    const userPostIds = userPost.map((post) => post.id);

    if (!userPostIds.includes(id)) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        title: updateUserDto.title,
        content: updateUserDto.content,
      },
    });

    return updatedPost;
  }

  async remove(req: Request, id: number): Promise<{ message: string }> {
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    const userPost = await this.prisma.post.findMany({
      where: { authorId: req['user'].id },
    });

    const userPostIds = userPost.map((post) => post.id);

    if (!userPostIds.includes(id)) {
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      );
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return {
      message: 'Post deleted successfully',
    };
  }
}
