import { DbConnection } from '@/database/config/db';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoothOrganizationController } from './controllers/booth-organization.controller';
import { BoothTemplateController } from './controllers/booth-template.controller';
import { BoothController } from './controllers/booth.controller';
import { ExhibitionController } from './controllers/exhibition.controller';
import { SpaceTemplateController } from './controllers/space-template.controller';
import { SpaceController } from './controllers/space.controller';
import { BoothDataConverter } from './converters/booth-data.converter';
import { BoothOrganizationDataConverter } from './converters/booth-organization-data.converter';
import { BoothOrganizationConverter } from './converters/booth-organization.converter';
import { BoothTemplateListConverter } from './converters/booth-template-list.converter';
import { BoothTemplateConverter } from './converters/booth-template.converter';
import { BoothConverter } from './converters/booth.converter';
import CategoryConverter from './converters/category.converter';
import { ExhibitionListConverter } from './converters/exhibition-list.converter';
import { ExhibitionConverter } from './converters/exhibition.converter';
import { LiveStreamConverter } from './converters/live-stream.converter';
import { LocationStatusConverter } from './converters/location-status.converter';
import { PositionBoothConverter } from './converters/position-booth.converter';
import { PositionSpaceConverter } from './converters/position-space.converter';
import { ProductConverter } from './converters/product.converter';
import { ProjectConverter } from './converters/project.converter';
import { SpaceDataConverter } from './converters/space-data.converter';
import { SpaceTemplateListConverter } from './converters/space-template-list.converter';
import { SpaceTemplateConverter } from './converters/space-template.converter';
import { SpaceConverter } from './converters/space.converter';
import { BoothData } from './entities/booth-data.entity';
import { BoothLocation } from './entities/booth-location.entity';
import { BoothOrganizationData } from './entities/booth-organization-data.entity';
import { BoothOrganization } from './entities/booth-organization.entity';
import { BoothTemplate } from './entities/booth-template.entity';
import { Booth } from './entities/booth.entity';
import { Category } from './entities/category.entity';
import { Exhibition } from './entities/exhibition.entity';
import { LiveStream } from './entities/livestream.entity';
import { LocationStatus } from './entities/location-status.entity';
import { PositionBooth } from './entities/position-booth.entity';
import { PositionSpace } from './entities/position-space.entity';
import { Product } from './entities/product.entity';
import { Project } from './entities/project.entity';
import { SpaceData } from './entities/space-data.entity';
import { SpaceTemplate } from './entities/space-template.entity';
import { Space } from './entities/space.entity';
import { BoothOrganizationService } from './services/booth-organization.service';
import { BoothTemplateService } from './services/booth-template.service';
import { BoothService } from './services/booth.service';
import { ExhibitionService } from './services/exhibition.service';
import { SpaceTemplateService } from './services/space-template.service';
import { SpaceService } from './services/space.service';

@Module({
    controllers: [
        ExhibitionController,
        BoothTemplateController,
        BoothOrganizationController,
        SpaceController,
        SpaceTemplateController,
        BoothController,
    ],
    providers: [
        ExhibitionService,
        BoothOrganizationService,
        SpaceService,
        BoothTemplateService,
        SpaceTemplateService,
        CategoryConverter,
        ExhibitionConverter,
        BoothOrganizationConverter,
        BoothOrganizationDataConverter,
        BoothTemplateConverter,
        BoothTemplateListConverter,
        SpaceConverter,
        SpaceDataConverter,
        SpaceTemplateConverter,
        PositionSpaceConverter,
        SpaceTemplateListConverter,
        PositionBoothConverter,
        ExhibitionListConverter,
        BoothService,
        BoothConverter,
        BoothDataConverter,
        ProductConverter,
        LiveStreamConverter,
        ProjectConverter,
        LocationStatusConverter,
    ],
    imports: [
        TypeOrmModule.forFeature(
            [
                Category,
                Exhibition,
                BoothOrganization,
                Space,
                BoothOrganizationData,
                SpaceData,
                BoothTemplate,
                SpaceTemplate,
                PositionSpace,
                PositionBooth,
                Booth,
                BoothLocation,
                LocationStatus,
                LiveStream,
                Product,
                Project,
                BoothData,
            ],
            DbConnection.exhibitionCon,
        ),
        HttpModule,
    ],
    exports: [TypeOrmModule],
})
export class ExhibitionModule {}
