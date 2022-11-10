import { DbConnection } from '@/database/config/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoothDataConverter } from '../exhibition/converters/booth-data.converter';
import { BoothOrganizationDataConverter } from '../exhibition/converters/booth-organization-data.converter';
import { BoothOrganizationConverter } from '../exhibition/converters/booth-organization.converter';
import { BoothTemplateConverter } from '../exhibition/converters/booth-template.converter';
import { BoothConverter } from '../exhibition/converters/booth.converter';
import CategoryConverter from '../exhibition/converters/category.converter';
import { ExhibitionConverter } from '../exhibition/converters/exhibition.converter';
import { LiveStreamConverter } from '../exhibition/converters/live-stream.converter';
import { PositionBoothConverter } from '../exhibition/converters/position-booth.converter';
import { PositionSpaceConverter } from '../exhibition/converters/position-space.converter';
import { SpaceDataConverter } from '../exhibition/converters/space-data.converter';
import { SpaceTemplateConverter } from '../exhibition/converters/space-template.converter';
import { SpaceConverter } from '../exhibition/converters/space.converter';
import { SpaceTemplateLocation } from '../exhibition/entities/space-template-location.entity';
import { BoothOrganizationData } from '../exhibition/entities/booth-organization-data.entity';
import { BoothOrganization } from '../exhibition/entities/booth-organization.entity';
import { BoothTemplate } from '../exhibition/entities/booth-template.entity';
import { Booth } from '../exhibition/entities/booth.entity';
import { Category } from '../exhibition/entities/category.entity';
import { Exhibition } from '../exhibition/entities/exhibition.entity';
import { Location } from '../exhibition/entities/location.entity';
import { PositionBooth } from '../exhibition/entities/position-booth.entity';
import { PositionSpace } from '../exhibition/entities/position-space.entity';
import { SpaceData } from '../exhibition/entities/space-data.entity';
import { SpaceTemplate } from '../exhibition/entities/space-template.entity';
import { Space } from '../exhibition/entities/space.entity';
import { MediaConverter } from '../media/converters/media.converter';
import { Media } from '../media/entities/media.entity';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { BoothImageConverter } from '../exhibition/converters/booth-image.converter';
import { BoothVideoConverter } from '../exhibition/converters/booth-video.converter';
import { BoothProjectConverter } from '../exhibition/converters/booth-project.converter';
import { BoothProductConverter } from '../exhibition/converters/booth-product.converter';
import { LocationConverter } from '../exhibition/converters/location.converter';
import { SpaceTemplateLocationConverter } from '../exhibition/converters/space-template-location.converter';
import { BoothImage } from '../exhibition/entities/booth-image.entity';
import { BoothVideo } from '../exhibition/entities/booth-video.entity';
import { BoothProject } from '../exhibition/entities/booth-project.entity';
import { BoothProduct } from '../exhibition/entities/booth-product.entity';
import { Video } from '../exhibition/entities/video.entity';
import { Image } from '../exhibition/entities/image.entity';
@Module({
    controllers: [PublicController],
    providers: [
        PublicService,
        ExhibitionConverter,
        CategoryConverter,
        ExhibitionConverter,
        SpaceTemplateConverter,
        SpaceConverter,
        BoothOrganizationConverter,
        BoothOrganizationDataConverter,
        BoothTemplateConverter,
        PositionSpaceConverter,
        PositionBoothConverter,
        SpaceDataConverter,
        BoothConverter,
        BoothDataConverter,
        LiveStreamConverter,
        BoothTemplateConverter,
        BoothImageConverter,
        BoothVideoConverter,
        BoothProjectConverter,
        BoothProductConverter,
        LocationConverter,
        SpaceTemplateLocationConverter,
        MediaConverter,
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
                Location,
                BoothImage,
                BoothVideo,
                BoothProject,
                BoothProduct,
                SpaceTemplateLocation,
                Video,
                Image,
            ],
            DbConnection.exhibitionCon,
        ),
        TypeOrmModule.forFeature([Media], DbConnection.mediaCon),
    ],
    exports: [TypeOrmModule],
})
export class PublicModule {}
