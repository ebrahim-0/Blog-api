import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enum/Role.enum';

export const Roles = (...args: Role[]) => SetMetadata('roles', args);
