import { EnterpriseModule } from '@/components/enterprise/enterprise.module';
import { ExhibitionModule } from '@/components/exhibition/exhibition.module';
import { DatabaseConnections } from '@/database/connections';
import { AccessLoggerMiddleware } from '@/middlewares/access-logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('EMAIL_HOST'),
                    port: configService.get<number>('EMAIL_PORT'),
                    secure: true,
                    auth: {
                        user: configService.get<string>('EMAIL_NAME'),
                        pass: configService.get<string>('EMAIL_PASS'),
                    },
                },
                defaults: {
                    from: `"No Reply" ${configService.get<string>(
                        'EMAIL_NAME',
                    )}`,
                },
                preview: true,
                template: {
                    dir: process.cwd() + '/src/utils/template/',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
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
