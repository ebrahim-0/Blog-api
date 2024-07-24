import { ParseIntPipe, UseGuards, NotFoundException } from '@nestjs/common';
import { Get, Post, Patch, Delete } from '@nestjs/common';
import { Controller, Param, Req, Body } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Post as PostModel } from '@prisma/client';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from 'src/enum/Role.enum';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { AllUsersRes, IUser, UserRes } from 'src/interfaces/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Details of the user to be created',
  })
  async register(
    @Req() req: Request,
    @Body() user: CreateUserDto,
  ): Promise<UserRes> {
    const newUser = await this.usersService.createUser(req, user);
    return {
      message: 'User created successfully',
      user: newUser.user,
      token: newUser.token,
    };
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully',
    schema: {
      example: {
        message: 'Users fetched successfully',
        users: [
          {
            id: 1,
            name: 'John Doe',
            email: 'test@test.com',
            role: 'user',
            created_at: '2021-09-22T09:00:00.000Z',
            updated_at: '2021-09-22T09:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Req() req: Request): Promise<AllUsersRes> {
    return await this.usersService.findAll(req);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.user)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<IUser> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.user)
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Details of the user to be updated',
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: IUser }> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles(Role.Admin, Role.user)
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }

  @Get(':id/posts')
  @Roles(Role.user)
  @ApiOperation({ summary: 'Get posts of a user by user ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User posts fetched successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async userPosts(@Param('id', ParseIntPipe) id: number): Promise<PostModel[]> {
    return await this.usersService.userPosts(id);
  }

  @Get(':id/posts/:postId')
  @Roles(Role.user)
  @ApiOperation({
    summary: 'Get a specific post of a user by user ID and post ID',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'User post fetched successfully' })
  @ApiResponse({ status: 404, description: 'User or post not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async userPost(
    @Param('id', ParseIntPipe) id: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostModel> {
    return await this.usersService.userPost(id, postId);
  }
}
