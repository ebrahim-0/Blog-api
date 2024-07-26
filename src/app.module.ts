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
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PostsModule } from './posts/posts.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UsersModule, PostsModule, ConfigModule.forRoot()],
  controllers: [AppController, AdminController, AuthController],
  providers: [AppService, PrismaService, AdminService, AuthService],
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
      .forRoutes('users', 'posts', 'admin');
  }
}
