import { EnterpriseModule } from '@/components/enterprise/enterprise.module';
import { ExhibitionModule } from '@/components/exhibition/exhibition.module';
import { DatabaseConnections } from '@/database/connections';
import { AccessLoggerMiddleware } from '@/middlewares/access-logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as OpenApiValidator from 'express-openapi-validator';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpLogger } from '@/loggers/http.logger';
import { Logger } from '@/loggers/default.logger';
import { MediaModule } from '@/components/media/media.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from '@/components/user/user.module';
import { RouterModule } from '@nestjs/core';
import { PublicModule } from './components/public/public.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../resources'),
            serveRoot: '/resources',
        }),
        ...DatabaseConnections,
        ExhibitionModule,
        EnterpriseModule,
        MediaModule,
        UserModule,
        PublicModule,
        RouterModule.register([
            {
                path: '/api/v1',
                module: ExhibitionModule,
            },
            {
                path: '/api/v1',
                module: EnterpriseModule,
            },
            {
                path: '/api/v1',
                module: MediaModule,
            },
            {
                path: '/api/v1',
                module: UserModule,
            },
            {
                path: '/public/api/v1',
                module: PublicModule,
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService, HttpLogger, Logger],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                AccessLoggerMiddleware,
                ...OpenApiValidator.middleware({
                    apiSpec: join(__dirname, '../openapi/openapi.yaml'),
                    validateRequests: {
                        allowUnknownQueryParameters: true,
                        coerceTypes: false,
                    },
                    // validateResponses: true,
                    validateFormats: 'full',
                }),
                ...OpenApiValidator.middleware({
                    apiSpec: join(__dirname, '../openapi/public-api.yaml'),
                    validateRequests: {
                        allowUnknownQueryParameters: true,
                        coerceTypes: false,
                    },
                    validateFormats: 'full',
                }),
            )
            .forRoutes('*');
    }
}
