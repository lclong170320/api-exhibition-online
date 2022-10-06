import { DbConnection } from '@/database/config/db';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enterprise } from './entities/enterprise.entity';
import { Document } from './entities/document.entity';
import { HttpModule } from '@nestjs/axios';
import { DocumentConverter } from './converters/enterprise-document.converter';
import { Profile } from './entities/profile.entity';
import { ProfileConverter } from './converters/enterprise-profile.converter';
import { EnterpriseConverter } from './converters/enterprise.converter';
import { EnterpriseListConverter } from './converters/enterprise-list.converter';
import { EnterpriseRepository } from './enterprise.repository';

@Module({
    controllers: [EnterpriseController],
    providers: [
        EnterpriseService,
        DocumentConverter,
        ProfileConverter,
        EnterpriseConverter,
        EnterpriseListConverter,
        EnterpriseRepository,
    ],
    imports: [
        TypeOrmModule.forFeature(
            [Enterprise, Document, Profile],
            DbConnection.enterpriseCon,
        ),
        HttpModule,
    ],
    exports: [TypeOrmModule],
})
export class EnterpriseModule {}
