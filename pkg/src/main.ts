import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiPrefix } from '@/constants/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(apiPrefix.version1);
    const document = load(
        readFileSync(join(__dirname, 'openapi/openapi.yaml'), 'utf8'),
    ) as OpenAPIObject;
    SwaggerModule.setup('/docs', app, document);

    await app.listen(3000);
}

bootstrap();
