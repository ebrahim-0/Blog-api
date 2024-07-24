import { Post as PostModel } from '@prisma/client';

export interface AllPostsRes {
  posts: PostModel[];
  currentPage: number;
  perPage: number;
  totalItems: number;
  hasMore: boolean;
}
