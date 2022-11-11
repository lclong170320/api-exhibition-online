import { DbConnection } from '@/database/config/db';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoothOrganizationController } from './controllers/booth-organization.controller';
import { ExhibitionController } from './controllers/exhibition.controller';
import CategoryConverter from './converters/category.converter';
import { ExhibitionConverter } from './converters/exhibition.converter';
import { BoothOrganization } from './entities/booth-organization.entity';
import { BoothTemplate } from './entities/booth-template.entity';
import { Category } from './entities/category.entity';
import { Exhibition } from './entities/exhibition.entity';
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
import { SpaceTemplateListConverter } from './converters/space-template-list.converter';
import { ExhibitionListConverter } from './converters/exhibition-list.converter';
import { Booth } from './entities/booth.entity';
import { SpaceTemplateLocation } from './entities/space-template-location.entity';
import { Location } from './entities/location.entity';
import { BoothConverter } from './converters/booth.converter';
import { LiveStreamConverter } from './converters/live-stream.converter';
import { LiveStream } from './entities/live-stream.entity';
import { Product } from './entities/product.entity';
import { Project } from './entities/project.entity';
import { Video } from './entities/video.entity';
import { Image } from './entities/image.entity';
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
import { BoothOrganizationImage } from './entities/booth-organization-image.entity';
import { BoothOrganizationVideo } from './entities/booth-organization-video.entity';
import { BoothOrganizationProject } from './entities/booth-organization-project.entity';
import { BoothOrganizationProduct } from './entities/booth-organization-product.entity';
import { BoothOrganizationTemplate } from './entities/booth-organization-template.entity';
import { BoothOrganizationTemplatePosition } from './entities/booth-organization-template-position.entity';
import { BoothTemplatePosition } from './entities/booth-template-position.entity';
import { BoothOrganizationConverter } from './converters/booth-organization.converter';
import { BoothOrganizationTemplatePositionConverter } from './converters/booth-organization-template-position.converter';
import { BoothOrganizationImageConverter } from './converters/booth-organization-image.converter';
import { BoothOrganizationVideoConverter } from './converters/booth-organization-video.converter';
import { BoothOrganizationProductConverter } from './converters/booth-organization-product.converter';
import { BoothOrganizationProjectConverter } from './converters/booth-organization-project.converter';
import { BoothOrganizationTemplateConverter } from './converters/booth-organization-template.converter';

@Module({
    controllers: [
        ExhibitionController,
        BoothTemplateController,
        BoothOrganizationController,
        SpaceController,
        SpaceTemplateController,
    ],
    providers: [
        // service
        ExhibitionService,
        BoothTemplateService,
        BoothOrganizationService,
        SpaceService,
        SpaceTemplateService,
        // converter
        CategoryConverter,
        ExhibitionListConverter,
        ExhibitionConverter,
        BoothTemplateConverter,
        BoothTemplateListConverter,
        SpaceConverter,
        SpaceDataConverter,
        SpaceTemplateConverter,
        SpaceTemplateListConverter,
        PositionSpaceConverter,
        BoothConverter,
        LiveStreamConverter,
        BoothImageConverter,
        BoothVideoConverter,
        BoothProjectConverter,
        BoothProductConverter,
        LocationConverter,
        SpaceTemplateLocationConverter,
        BoothOrganizationConverter,
        BoothOrganizationTemplatePositionConverter,
        BoothOrganizationImageConverter,
        BoothOrganizationVideoConverter,
        BoothOrganizationProductConverter,
        BoothOrganizationProjectConverter,
        BoothOrganizationTemplateConverter,
    ],
    imports: [
        TypeOrmModule.forFeature(
            [
                BoothImage,
                BoothOrganizationImage,
                BoothOrganizationProduct,
                BoothOrganizationProject,
                BoothOrganizationTemplatePosition,
                BoothOrganizationTemplate,
                BoothOrganizationVideo,
                BoothOrganization,
                BoothProduct,
                BoothProject,
                BoothTemplatePosition,
                BoothTemplate,
                BoothVideo,
                Booth,
                Category,
                Exhibition,
                Image,
                BoothOrganization,
                Space,
                SpaceData,
                BoothTemplate,
                SpaceTemplate,
                PositionSpace,
                Booth,
                SpaceTemplateLocation,
                Location,
                LiveStream,
                Location,
                PositionSpace,
                Product,
                Project,
                SpaceData,
                SpaceTemplateLocation,
                SpaceTemplate,
                Space,
                Video,
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
