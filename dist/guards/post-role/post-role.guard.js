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
exports.PostRoleGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const Role_enum_1 = require("../../enum/Role-enum");
let PostRoleGuard = class PostRoleGuard {
    constructor(_Reflector) {
        this._Reflector = _Reflector;
    }
    canActivate(context) {
        const roles = this._Reflector.getAllAndMerge('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!roles || !roles.length) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request['user'];
        if (!user.role) {
            throw new common_1.ForbiddenException('No role found');
        }
        console.log(roles, user.role);
        if (user.role === Role_enum_1.Role.Admin)
            return true;
        return this.matchRoles(roles, user.role);
    }
    matchRoles(roles, userRoles) {
        return roles.some((role) => role === userRoles);
    }
};
exports.PostRoleGuard = PostRoleGuard;
exports.PostRoleGuard = PostRoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PostRoleGuard);
//# sourceMappingURL=post-role.guard.js.map