import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './exceptions/validation.exception';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter());

  app.enableCors();

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

  await app.listen(PORT);
}
bootstrap();
