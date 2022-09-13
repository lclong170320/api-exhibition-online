import { EnterpriseModule } from '@/components/enterprise/enterprise.module';
import { ExhibitionModule } from '@/components/exhibition/exhibition.module';
import { MockModule } from '@/components/mock/mock.module';
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
    providers: [AppService, HttpLogger, Logger],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                AccessLoggerMiddleware,
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
