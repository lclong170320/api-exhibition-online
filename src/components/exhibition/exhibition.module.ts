import { DbConnection } from '@/database/config/db';
import { ExhibitionService } from './services/exhibition.service';
import { ExhibitionController } from './controllers/exhibition.controller';
import { BoothController } from './controllers/booth.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibition } from './entities/exhibition.entity';
import { BoothConverter } from './converters/booth.converter';
import { HttpModule } from '@nestjs/axios';
import { BoothDataConverter } from './converters/booth-data.converter';
import { Booth } from './entities/booth.entity';
import { BoothData } from './entities/booth-data.entity';
import { PositionBooth } from './entities/position-booth.entity';
import CategoryConverter from './converters/category.converter';
import { ExhibitionConverter } from './converters/exhibition.converter';
import { Category } from './entities/category.entity';
import { BoothTemplate } from './entities/booth-template.entity';
import { PositionSpace } from './entities/position-space.entity';
import { SpaceData } from './entities/space-data.entity';
import { SpaceTemplate } from './entities/space-template.entity';
import { Space } from './entities/space.entity';
import { BoothTemplateService } from './services/booth-template.service';
import { BoothService } from './services/booth.service';
import { BoothTemplateListConverter } from './converters/booth-template-list.converter';
import { BoothTemplateConverter } from './converters/booth-template.converter';
import { BoothTemplateController } from './controllers/booth-template.controller';
import { SpaceController } from './controllers/space.controller';
import { SpaceService } from './services/space.service';
import { SpaceConverter } from './converters/space.converter';
import { SpaceDataConverter } from './converters/space-data.converter';
import { SpaceTemplateController } from './controllers/space-template.controller';
import { SpaceTemplateService } from './services/space-template.service';
import { SpaceTemplateConverter } from './converters/space-template.converter';
import { PositionSpaceConverter } from './converters/position-space.converter';
import { PositionBoothConverter } from './converters/position-booth.converter';

@Module({
    controllers: [
        ExhibitionController,
        BoothTemplateController,
        BoothController,
        SpaceController,
        SpaceTemplateController,
    ],
    providers: [
        ExhibitionService,
        BoothService,
        SpaceService,
        BoothTemplateService,
        SpaceTemplateService,
        CategoryConverter,
        ExhibitionConverter,
        BoothConverter,
        BoothDataConverter,
        BoothTemplateConverter,
        BoothTemplateListConverter,
        SpaceConverter,
        SpaceDataConverter,
        SpaceTemplateConverter,
        PositionSpaceConverter,
        PositionBoothConverter,
    ],
    imports: [
        TypeOrmModule.forFeature(
            [
                Category,
                Exhibition,
                Booth,
                Space,
                BoothData,
                SpaceData,
                BoothTemplate,
                SpaceTemplate,
                PositionSpace,
                PositionBooth,
            ],
            DbConnection.exhibitionCon,
        ),
        HttpModule,
    ],
    exports: [TypeOrmModule],
})
export class ExhibitionModule {}
