import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum/Role.enum';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(req: Request, user: CreateUserDto) {
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

    const token = jwt.sign({ ...userWithoutPassword }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return { token, user: userWithoutPassword };
  }

  async findAll(req: Request) {
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
      },
    });

    const hasMore = skip + users.length < totalItems;

    return {
      users,
      currentPage: page,
      perPage: limit,
      totalItems,
      hasMore,
    };
  }

  async findOne(id: number) {
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
      },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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

    return updatedUser;
  }

  async remove(id: number) {
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

  async userPosts(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        posts: true,
      },
    });

    return user.posts;
  }

  async userPost(id: number, postId: number) {
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
