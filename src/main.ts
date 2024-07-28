import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './exceptions/validation.exception';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import 'colors';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        let formattedErrors = {};
        errors.forEach((error) => {
          formattedErrors[error.property] = Object.values(error.constraints);
        });

        return new BadRequestException({
          errors: formattedErrors,
          error: 'Bad Request',
          statusCode: 400,
        });
      },
    }),
  );

  // app.useGlobalFilters(new ValidationExceptionFilter());

  app.enableCors({
    origin: ['http://localhost:5173', 'https://blog-pied-two-98.vercel.app'],
    credentials: true, // Allow credentials
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    exposedHeaders: [
      'Set-Cookie',
      'Authorization',
      'Origin',
      'X-Requested-With',
      'x-refresh-token',
      'Content-Type',
      'Accept',
    ],
  });
  app.use(cookieParser('MY SECRET'));

  const options = new DocumentBuilder()
    .setTitle('NestJS Prisma Blog API')
    .setDescription('API for a blog application using NestJS and Prisma')
    .setVersion('1.0')
    .addTag('blog')
    .addServer('https://blog-api-nest.up.railway.app', 'Production server')
    .addServer('http://localhost:5000', 'Local development server')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT, () => {
    console.log(
      `Server is running on http://localhost:${PORT}`.cyan.underline.bold,
    );
  });
}
bootstrap();
