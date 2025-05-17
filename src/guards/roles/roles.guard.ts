import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from 'src/enum/Role-enum';

@Injectable()
export class RolesGuard implements CanActivate {
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

    if (user.role === Role.Admin) return true;

    if (user.id === +request.params.id) {
      return true;
    } else {
      throw new NotAcceptableException(
        `You does not have access to ${request.method.toLocaleLowerCase()}`,
      );
    }
  }
}
