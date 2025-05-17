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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const roles_decorator_1 = require("../decorators/roles/roles.decorator");
const Role_enum_1 = require("../enum/Role-enum");
const auth_guard_1 = require("../guards/auth/auth.guard");
const roles_guard_1 = require("../guards/roles/roles.guard");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(req, user) {
        const newUser = await this.usersService.createUser(req, user);
        return {
            message: 'User created successfully',
            user: newUser.user,
            token: newUser.token,
        };
    }
    async findAll(req) {
        return await this.usersService.findAll(req);
    }
    async findOne(id) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, updateUserDto) {
        const updatedUser = await this.usersService.update(id, updateUserDto);
        return {
            message: 'User updated successfully',
            user: updatedUser,
        };
    }
    remove(id) {
        return this.usersService.remove(id);
    }
    async userPosts(id) {
        return await this.usersService.userPosts(id);
    }
    async userPost(id, postId) {
        return await this.usersService.userPost(id, postId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_2.Post)(),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.Admin),
    (0, swagger_2.ApiOperation)({ summary: 'Create a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_2.ApiBody)({
        type: create_user_dto_1.CreateUserDto,
        description: 'Details of the user to be created',
    }),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_2.Get)(),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.Admin),
    (0, swagger_2.ApiOperation)({ summary: 'Get all users' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_3.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_2.Get)(':id'),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.Admin, Role_enum_1.Role.user),
    (0, swagger_2.ApiOperation)({ summary: 'Get a user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_3.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_2.Patch)(':id'),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.Admin, Role_enum_1.Role.user),
    (0, swagger_2.ApiOperation)({ summary: 'Update a user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'User ID' }),
    (0, swagger_2.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
        description: 'Details of the user to be updated',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_3.Param)('id')),
    __param(1, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_2.Delete)(':id'),
    (0, swagger_2.ApiOperation)({ summary: 'Delete a user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.Admin, Role_enum_1.Role.user),
    __param(0, (0, common_3.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_2.Get)(':id/posts'),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.user),
    (0, swagger_2.ApiOperation)({ summary: 'Get posts of a user by user ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User posts fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_3.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userPosts", null);
__decorate([
    (0, common_2.Get)(':id/posts/:postId'),
    (0, roles_decorator_1.Roles)(Role_enum_1.Role.user),
    (0, swagger_2.ApiOperation)({
        summary: 'Get a specific post of a user by user ID and post ID',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'User ID' }),
    (0, swagger_1.ApiParam)({ name: 'postId', type: Number, description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User post fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or post not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_3.Param)('id')),
    __param(1, (0, common_3.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userPost", null);
exports.UsersController = UsersController = __decorate([
    (0, common_3.Controller)('users'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_2.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map