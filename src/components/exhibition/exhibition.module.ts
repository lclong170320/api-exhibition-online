import { DbConnection } from '@/database/config/db';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoothOrganizationController } from './controllers/booth-organization.controller';
import { ExhibitionController } from './controllers/exhibition.controller';
import { BoothOrganizationDataConverter } from './converters/booth-organization-data.converter';
import { BoothOrganizationConverter } from './converters/booth-organization.converter';
import CategoryConverter from './converters/category.converter';
import { ExhibitionConverter } from './converters/exhibition.converter';
import { BoothOrganizationData } from './entities/booth-organization-data.entity';
import { BoothOrganization } from './entities/booth-organization.entity';
import { BoothTemplate } from './entities/booth-template.entity';
import { Category } from './entities/category.entity';
import { Exhibition } from './entities/exhibition.entity';
import { PositionBooth } from './entities/position-booth.entity';
import { PositionSpace } from './entities/position-space.entity';
import { SpaceData } from './entities/space-data.entity';
import { SpaceTemplate } from './entities/space-template.entity';
import { Space } from './entities/space.entity';
import { BoothOrganizationService } from './services/booth-organization.service';
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
import { SpaceTemplateListConverter } from './converters/space-template-list.converter';
import { ExhibitionListConverter } from './converters/exhibition-list.converter';
import { Booth } from './entities/booth.entity';
import { SpaceTemplateLocation } from './entities/space-template-location.entity';
import { Location } from './entities/location.entity';
import { BoothConverter } from './converters/booth.converter';
import { BoothDataConverter } from './converters/booth-data.converter';
import { LiveStreamConverter } from './converters/live-stream.converter';
import { LiveStream } from './entities/live-stream.entity';
import { Product } from './entities/product.entity';
import { BoothData } from './entities/booth-data.entity';
import { Project } from './entities/project.entity';
import { Video } from './entities/video.entity';
import { ExhibitionService } from './services/exhibition.service';
import { BoothTemplateService } from './services/booth-template.service';
import { BoothImageConverter } from './converters/booth-image.converter';
import { BoothVideoConverter } from './converters/booth-video.converter';
import { BoothProjectConverter } from './converters/booth-project.converter';
import { BoothProductConverter } from './converters/booth-product.converter';
import { LocationConverter } from './converters/location.converter';
import { BoothImage } from './entities/booth-image.entity';
import { BoothVideo } from './entities/booth-video.entity';
import { BoothProject } from './entities/booth-project.entity';
import { BoothProduct } from './entities/booth-product.entity';
import { SpaceTemplateLocationConverter } from './converters/space-template-location.converter';
import { Image } from '../exhibition/entities/image.entity';

@Module({
    controllers: [
        ExhibitionController,
        BoothTemplateController,
        BoothOrganizationController,
        SpaceController,
        SpaceTemplateController,
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
        BoothConverter,
        BoothDataConverter,
        LiveStreamConverter,
        BoothImageConverter,
        BoothVideoConverter,
        BoothProjectConverter,
        BoothProductConverter,
        LocationConverter,
        SpaceTemplateLocationConverter,
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
                SpaceTemplateLocation,
                Location,
                LiveStream,
                Product,
                Project,
                BoothData,
                BoothImage,
                BoothVideo,
                BoothProject,
                BoothProduct,
                Video,
                Image,
            ],
            DbConnection.exhibitionCon,
        ),
        HttpModule,
    ],
    exports: [TypeOrmModule],
})
export class ExhibitionModule {}
