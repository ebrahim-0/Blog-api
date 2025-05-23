import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { Post as PostModel } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@/enum/Role-enum';
import { PrismaService } from '@/prisma/prisma.service';
import { AllUsersRes, IUser } from '@/interfaces/user';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(
    req: Request,
    user: CreateUserDto,
  ): Promise<{ token: string; user: IUser }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (user.role === Role.Admin && req['user'].role !== Role.Admin) {
      throw new UnauthorizedException('Only admins can create admin accounts');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const createdUser = await this.prisma.user.create({
      data: user,
    });

    const { password, ...userWithoutPassword } = createdUser;

    const token = this.jwtService.sign(userWithoutPassword, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1m',
    });

    return { token, user: userWithoutPassword };
  }

  async findAll(req: Request): Promise<AllUsersRes> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await this.prisma.user.count();

    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        posts: true,
        refreshToken: true,
        isRestToken: true,
      },
    });

    const hasMore = skip + users.length < totalItems;

    const totalPages = Math.ceil(totalItems / limit);

    return {
      users,
      currentPage: page,
      perPage: limit,
      totalPages,
      totalItems,
      hasMore,
    };
  }

  async findOne(id: string): Promise<IUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        posts: true,
        createdAt: true,
        updatedAt: true,
        refreshToken: true,
        isRestToken: true,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        updatedAt: new Date(),
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'User deleted successfully',
    };
  }

  async userPosts(id: string): Promise<PostModel[]> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        posts: true,
      },
    });

    return user.posts;
  }

  async userPost(id: string, postId: string): Promise<PostModel> {
    const userPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
        authorId: id,
      },
    });

    if (!userPost) {
      throw new NotFoundException('Post not found');
    }

    return userPost;
  }
}
