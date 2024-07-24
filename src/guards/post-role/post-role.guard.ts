import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/enum/Role.enum';

@Injectable()
export class PostRoleGuard implements CanActivate {
  constructor(private _Reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this._Reflector.getAllAndMerge<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || !roles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'];

    if (!user.role) {
      throw new ForbiddenException('No role found');
    }

    console.log(roles, user.role);

    if (user.role === Role.Admin) return true;

    return this.matchRoles(roles, user.role);
  }

  matchRoles(roles: string[], userRoles: string): boolean {
    return roles.some((role) => role === userRoles);
  }
}
