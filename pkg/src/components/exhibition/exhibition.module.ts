import { DbConnection } from '@/database/config/db';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoothTemplateController } from './controllers/booth-template.controller';
import { BoothTemplateListConverter } from './converters/booth-template-list.converter';
import { BoothTemplateConverter } from './converters/booth-template.converter';
import { ExhibitionConverter } from './converters/exhibition.converter';
import { BoothData } from './entities/booth-data.entity';
import { BoothTemplate } from './entities/booth-template.entity';
import { Booth } from './entities/booth.entity';
import { Category } from './entities/category.entity';
import { Exhibition } from './entities/exhibition.entity';
import { BoothTemplateService } from './services/booth-template.service';

@Module({
    controllers: [BoothTemplateController],
    providers: [
        ExhibitionConverter,
        BoothTemplateService,
        BoothTemplateConverter,
        BoothTemplateListConverter,
    ],
    imports: [
        TypeOrmModule.forFeature(
            [Exhibition, Booth, BoothData, Category, BoothTemplate],
            DbConnection.exhibitionCon,
        ),
        HttpModule,
    ],
    exports: [TypeOrmModule],
})
export class ExhibitionModule {}
