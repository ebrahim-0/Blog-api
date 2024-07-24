import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from 'src/enum/Role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'];

    if (!user.role) {
      throw new ForbiddenException('No role found');
    }

    if (user.role !== Role.Admin) {
      throw new ForbiddenException('You are not an admin');
    }
    return true;
  }
}
