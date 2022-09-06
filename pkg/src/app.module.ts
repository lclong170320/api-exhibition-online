import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConnections } from '@/database/connections';
import { ExhibitionModule } from '@/components/exhibition/exhibition.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import * as OpenApiValidator from 'express-openapi-validator';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { OpenApiExceptionFilter } from '@/openapi/filters/openapi-exception.filter';
import { EnterpriseModule } from '@/components/enterprise/enterprise.module';
import { MockModule } from './components/mock/mock.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ...DatabaseConnections,
        ExhibitionModule,
        EnterpriseModule,
        MockModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_FILTER, useClass: OpenApiExceptionFilter },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                ...OpenApiValidator.middleware({
                    apiSpec: join(__dirname, '/openapi/openapi.yaml'),
                    validateRequests: {
                        allowUnknownQueryParameters: true,
                        coerceTypes: false,
                    },
                    validateResponses: true,
                    validateFormats: 'full',
                }),
            )
            .forRoutes('*');
    }
}
