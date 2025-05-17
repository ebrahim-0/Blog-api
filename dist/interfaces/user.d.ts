import { User as UserModel } from '@prisma/client';
export interface AllUsersRes {
    users: Omit<UserModel, 'password'>[];
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
}
export type IUser = Omit<UserModel, 'password'>;
export interface UserRes {
    message: string;
    user: Omit<UserModel, 'password'>;
    token: string;
}
