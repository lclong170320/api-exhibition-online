import { AppExceptionFilter } from '@/exceptions/filters/app-exception.filter';
import { Logger } from '@/loggers/default.logger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    const configService = app.get(ConfigService);
    app.use(bodyParser.json({ limit: configService.get('MAX_MEDIA_SIZE') }));
    app.use(
        bodyParser.urlencoded({
            limit: configService.get('MAX_MEDIA_SIZE'),
            extended: true,
        }),
    );
    const api = load(
        readFileSync(join(__dirname, '../openapi/openapi.yaml'), 'utf8'),
    ) as OpenAPIObject;
    SwaggerModule.setup('/api/v1', app, api);

    const publicApi = load(
        readFileSync(join(__dirname, '../openapi/public-api.yaml'), 'utf8'),
    ) as OpenAPIObject;
    SwaggerModule.setup('/public/api/v1', app, publicApi);

    const logger = app.get<Logger>(Logger);
    app.useGlobalFilters(new AppExceptionFilter(logger));

    await app.listen(3000);
}

bootstrap();
