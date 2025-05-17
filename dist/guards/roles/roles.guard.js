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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const Role_enum_1 = require("../../enum/Role-enum");
let RolesGuard = class RolesGuard {
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
        if (user.role === Role_enum_1.Role.Admin)
            return true;
        if (user.id === +request.params.id) {
            return true;
        }
        else {
            throw new common_1.NotAcceptableException(`You does not have access to ${request.method.toLocaleLowerCase()}`);
        }
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map