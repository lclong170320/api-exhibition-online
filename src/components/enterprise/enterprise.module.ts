import { DbConnection } from '@/database/config/db';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enterprise } from './entities/enterprise.entity';
import { HttpModule } from '@nestjs/axios';
import { EnterpriseConverter } from './converters/enterprise.converter';
import { PaginatedEnterprisesConverter } from './converters/paginated-enterprises.converter';

@Module({
    controllers: [EnterpriseController],
    providers: [
        EnterpriseService,
        EnterpriseConverter,
        PaginatedEnterprisesConverter,
    ],
    imports: [
        TypeOrmModule.forFeature([Enterprise], DbConnection.enterpriseCon),
        HttpModule,
    ],
    exports: [TypeOrmModule],
})
export class EnterpriseModule {}
