import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from 'src/enum/Role.enum';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRoleGuard } from 'src/guards/post-role/post-role.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('posts')
@ApiTags('posts')
@ApiBearerAuth()
@UseGuards(AuthGuard, PostRoleGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Roles(Role.user)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    type: CreatePostDto,
    description: 'Details of the post to be created',
  })
  async register(@Req() req: Request, @Body() user: CreatePostDto) {
    const post = await this.postsService.createUser(req, user);
    return {
      message: 'post created successfully',
      post,
    };
  }

  @Get()
  @Roles(Role.Admin, Role.user)
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'Posts fetched successfully',
    schema: {
      example: {
        message: 'Posts fetched successfully',
        posts: [
          {
            id: 1,
            title: 'Post Title',
            content: 'Post content',
            userId: 1,
            createdAt: '2021-09-22T09:00:00.000Z',
            updatedAt: '2021-09-22T09:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: Request) {
    return await this.postsService.findAll(req);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.user)
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post found' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.postsService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Patch(':id')
  @Roles(Role.user)
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiBody({
    type: UpdatePostDto,
    description: 'Details of the post to be updated',
  })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdatePostDto,
  ) {
    const updatedUser = await this.postsService.update(req, id, updateUserDto);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.user)
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(req, id);
  }
}
