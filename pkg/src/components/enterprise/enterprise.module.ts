import { DbConnection } from '@/database/config/db';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enterprise } from './entities/enterprise.entity';
import { Document } from './entities/document.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentConverter } from './converters/enterprise-document.converter';

@Module({
    controllers: [EnterpriseController],
    providers: [EnterpriseService, DocumentConverter],
    imports: [
        TypeOrmModule.forFeature(
            [Enterprise, Document],
            DbConnection.enterpriseCon,
        ),
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                timeout: configService.get('HTTP_TIMEOUT'),
                maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [TypeOrmModule],
})
export class EnterpriseModule {}
