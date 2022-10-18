import { apiPrefix } from '@/constants/common';
import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';
import { AppModule } from './app.module';
import { AppExceptionFilter } from '@/exceptions/filters/app-exception.filter';
import { Logger } from '@/loggers/default.logger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.setGlobalPrefix(apiPrefix.version1);
    app.use(bodyParser.json({ limit: configService.get('MAX_MEDIA_SIZE') }));
    app.use(
        bodyParser.urlencoded({
            limit: configService.get('MAX_MEDIA_SIZE'),
            extended: true,
        }),
    );
    const document = load(
        readFileSync(join(__dirname, '../openapi/openapi.yaml'), 'utf8'),
    ) as OpenAPIObject;
    SwaggerModule.setup('/docs', app, document);
    const logger = app.get<Logger>(Logger);
    app.useGlobalFilters(new AppExceptionFilter(logger));
    await app.listen(3000);
}

bootstrap();
