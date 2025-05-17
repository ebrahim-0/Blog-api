"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const roles_decorator_1 = require("../decorators/roles/roles.decorator");
const Role_enum_1 = require("../enum/Role-enum");
const auth_guard_1 = require("../guards/auth/auth.guard");
const post_role_guard_1 = require("../guards/post-role/post-role.guard");
const create_post_dto_1 = require("./dto/create-post.dto");
const update_post_dto_1 = require("./dto/update-post.dto");
const posts_service_1 = require("./posts.service");
let PostsController = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    async create(req, user) {
        const post = await this.postsService.createUser(req, user);
        return {
            message: 'post created successfully',
            post,
        };
    }
    async findAll(req) {
        return await this.postsService.findAll(req);
    }
    async findOne(id) {
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new common_1.NotFoundException('post not found');
        }
        return post;
    }
    async update(req, id, updatePostDto) {
        const updatedPost = await this.postsService.update(req, id, updatePostDto);
        return {
            message: 'Post updated successfully',
            post: updatedPost,
        };
    }
    remove(req, id) {
        return this.postsService.remove(req, id);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_2.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, post_role_guard_1.PostRoleGuard),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.user),
    (0, swagger_2.ApiOperation)({ summary: 'Create a new post' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Post created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_2.ApiBody)({
        type: create_post_dto_1.CreatePostDto,
        description: 'Details of the post to be created',
    }),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "create", null);
__decorate([
    (0, common_2.Get)(),
    (0, swagger_2.ApiOperation)({ summary: 'Get all posts' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_3.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findAll", null);
__decorate([
    (0, common_2.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, post_role_guard_1.PostRoleGuard),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.Admin, Role_enum_1.Role.user),
    (0, swagger_2.ApiOperation)({ summary: 'Get a post by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_3.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findOne", null);
__decorate([
    (0, common_2.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, post_role_guard_1.PostRoleGuard),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.user),
    (0, swagger_2.ApiOperation)({ summary: 'Update a post by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Post ID' }),
    (0, swagger_2.ApiBody)({
        type: update_post_dto_1.UpdatePostDto,
        description: 'Details of the post to be updated',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_3.Param)('id')),
    __param(2, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "update", null);
__decorate([
    (0, common_2.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, post_role_guard_1.PostRoleGuard),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.Admin, Role_enum_1.Role.user),
    (0, swagger_2.ApiOperation)({ summary: 'Delete a post by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_3.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "remove", null);
exports.PostsController = PostsController = __decorate([
    (0, common_3.Controller)('posts'),
    (0, swagger_1.ApiTags)('posts'),
    (0, swagger_2.ApiBearerAuth)(),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map