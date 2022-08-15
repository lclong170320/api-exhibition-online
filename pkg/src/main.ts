import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiPrefix } from '@/constants/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(apiPrefix.version1);
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Compaon API')
        .setDescription('API developed throughout the API with NestJS course')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);

    await app.listen(3000);
}
bootstrap();
