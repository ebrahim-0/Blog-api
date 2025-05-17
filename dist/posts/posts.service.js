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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostsService = class PostsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(req, user) {
        const newPost = await this.prisma.post.create({
            data: {
                title: user.title,
                content: user.content,
                authorId: req['user'].id,
            },
        });
        return newPost;
    }
    async findAll(req) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
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
    async findOne(id) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        return post;
    }
    async update(req, id, updateUserDto) {
        const existingPost = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!existingPost) {
            throw new common_1.NotFoundException('Post not found');
        }
        const userPost = await this.prisma.post.findMany({
            where: { authorId: req['user'].id },
        });
        const userPostIds = userPost.map((post) => post.id);
        if (!userPostIds.includes(id)) {
            throw new common_2.UnauthorizedException('You are not authorized to update this post');
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
    async remove(req, id) {
        const existingPost = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!existingPost) {
            throw new common_1.NotFoundException('Post not found');
        }
        const userPost = await this.prisma.post.findMany({
            where: { authorId: req['user'].id },
        });
        const userPostIds = userPost.map((post) => post.id);
        if (!userPostIds.includes(id)) {
            throw new common_2.UnauthorizedException('You are not authorized to delete this post');
        }
        await this.prisma.post.delete({
            where: { id },
        });
        return {
            message: 'Post deleted successfully',
        };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map