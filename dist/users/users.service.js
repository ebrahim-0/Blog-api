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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const Role_enum_1 = require("../enum/Role-enum");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async createUser(req, user) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: user.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (user.role === Role_enum_1.Role.Admin && req['user'].role !== Role_enum_1.Role.Admin) {
            throw new common_1.UnauthorizedException('Only admins can create admin accounts');
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
    async findAll(req) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
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
    async findOne(id) {
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
    async update(id, updateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
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
    async remove(id) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.delete({
            where: { id },
        });
        return {
            message: 'User deleted successfully',
        };
    }
    async userPosts(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                posts: true,
            },
        });
        return user.posts;
    }
    async userPost(id, postId) {
        const userPost = await this.prisma.post.findFirst({
            where: {
                id: postId,
                authorId: id,
            },
        });
        if (!userPost) {
            throw new common_1.NotFoundException('Post not found');
        }
        return userPost;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map