import { Role } from '@/enum/Role-enum';
export declare class UserDto {
    name: string;
    email: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
}
export declare class CreateUserDto extends UserDto {
    password: string;
}
export declare class LoginUserDto {
    name: string;
    email: string;
    password: string;
}
