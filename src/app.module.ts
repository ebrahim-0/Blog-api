import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CookieMiddleware } from './middlewares/cookie/cookie.middleware';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot(),
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'posts',
        method: RequestMethod.GET,
      })
      .forRoutes('users', 'posts', 'admin')
      .apply(CookieMiddleware)
      .forRoutes('users', 'posts', 'admin');
  }
}
