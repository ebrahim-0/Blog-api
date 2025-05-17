"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
require("colors");
async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            let formattedErrors = {};
            errors.forEach((error) => {
                formattedErrors[error.property] = Object.values(error.constraints);
            });
            return new common_1.BadRequestException({
                errors: formattedErrors,
                error: 'Bad Request',
                statusCode: 400,
            });
        },
    }));
    app.enableCors({
        origin: ['http://localhost:5173', 'https://blog-pied-two-98.vercel.app'],
        credentials: true,
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
    const options = new swagger_1.DocumentBuilder()
        .setTitle('NestJS Prisma Blog API')
        .setDescription('API for a blog application using NestJS and Prisma')
        .setVersion('1.0')
        .addTag('blog')
        .addServer('http://localhost:5000', 'Local development server')
        .addServer('https://blog-api-nest.up.railway.app', 'Production server')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`.cyan.underline.bold);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map