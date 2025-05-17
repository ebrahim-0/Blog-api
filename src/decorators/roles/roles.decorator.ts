import { SetMetadata } from '@nestjs/common';
import { Role } from '@/enum/Role-enum';

export const Roles = (...args: Role[]) => SetMetadata('roles', args);
