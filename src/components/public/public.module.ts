import { DbConnection } from '@/database/config/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoothTemplateConverter } from '../exhibition/converters/booth-template.converter';
import { BoothConverter } from '../exhibition/converters/booth.converter';
import CategoryConverter from '../exhibition/converters/category.converter';
import { LiveStreamConverter } from '../exhibition/converters/live-stream.converter';
import { LocationConverter } from '../exhibition/converters/location.converter';
import { SpaceImageConverter } from '../exhibition/converters/space-image.converter';
import { SpaceTemplateLocationConverter } from '../exhibition/converters/space-template-location.converter';
import { SpaceTemplatePositionConverter } from '../exhibition/converters/space-template-position.converter';
import { SpaceTemplateConverter } from '../exhibition/converters/space-template.converter';
import { SpaceVideoConverter } from '../exhibition/converters/space-video.converter';
import { SpaceConverter } from '../exhibition/converters/space.converter';
import { SpaceTemplateLocation } from '../exhibition/entities/space-template-location.entity';
import { BoothOrganization } from '../exhibition/entities/booth-organization.entity';
import { BoothTemplate } from '../exhibition/entities/booth-template.entity';
import { Booth } from '../exhibition/entities/booth.entity';
import { Category } from '../exhibition/entities/category.entity';
import { Exhibition } from '../exhibition/entities/exhibition.entity';
import { Location } from '../exhibition/entities/location.entity';
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
import { BoothImage } from '../exhibition/entities/booth-image.entity';
import { BoothVideo } from '../exhibition/entities/booth-video.entity';
import { BoothProject } from '../exhibition/entities/booth-project.entity';
import { BoothProduct } from '../exhibition/entities/booth-product.entity';
import { LiveStream } from '../exhibition/entities/live-stream.entity';
import { BoothOrganizationImage } from '../exhibition/entities/booth-organization-image.entity';
import { BoothOrganizationProduct } from '../exhibition/entities/booth-organization-product.entity';
import { BoothOrganizationProject } from '../exhibition/entities/booth-organization-project.entity';
import { BoothOrganizationTemplatePosition } from '../exhibition/entities/booth-organization-template-position.entity';
import { BoothOrganizationTemplate } from '../exhibition/entities/booth-organization-template.entity';
import { BoothOrganizationVideo } from '../exhibition/entities/booth-organization-video.entity';
import { BoothTemplatePosition } from '../exhibition/entities/booth-template-position.entity';
import { Image } from '../exhibition/entities/image.entity';
import { Product } from '../exhibition/entities/product.entity';
import { Project } from '../exhibition/entities/project.entity';
import { Video } from '../exhibition/entities/video.entity';
import { BoothOrganizationTemplatePositionConverter } from '../exhibition/converters/booth-organization-template-position.converter';
import { BoothOrganizationConverter } from '../exhibition/converters/booth-organization.converter';
import { BoothOrganizationImageConverter } from '../exhibition/converters/booth-organization-image.converter';
import { BoothOrganizationVideoConverter } from '../exhibition/converters/booth-organization-video.converter';
import { BoothOrganizationProductConverter } from '../exhibition/converters/booth-organization-product.converter';
import { BoothOrganizationProjectConverter } from '../exhibition/converters/booth-organization-project.converter';
import { BoothOrganizationTemplateConverter } from '../exhibition/converters/booth-organization-template.converter';
import { SpaceTemplatePosition } from '../exhibition/entities/space-template-position.entity';

@Module({
    controllers: [PublicController],
    providers: [
        PublicService,
        // ExhibitionConverter,
        CategoryConverter,
        SpaceTemplateConverter,
        SpaceConverter,
        BoothTemplateConverter,
        BoothConverter,
        LiveStreamConverter,
        BoothTemplateConverter,
        BoothImageConverter,
        BoothVideoConverter,
        BoothProjectConverter,
        BoothProductConverter,
        LocationConverter,
        SpaceTemplateLocationConverter,
        LiveStreamConverter,
        MediaConverter,
        SpaceTemplatePositionConverter,
        SpaceImageConverter,
        SpaceVideoConverter,
        BoothOrganizationTemplatePositionConverter,
        BoothOrganizationConverter,
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
                BoothOrganization,
                Space,
                BoothTemplate,
                SpaceTemplate,
                SpaceTemplatePosition,
                Booth,
                Location,
                Image,
                LiveStream,
                Location,
                Product,
                Project,
                SpaceTemplateLocation,
                SpaceTemplate,
                Space,
                Video,
            ],
            DbConnection.exhibitionCon,
        ),
        TypeOrmModule.forFeature([Media], DbConnection.mediaCon),
    ],
    exports: [TypeOrmModule],
})
export class PublicModule {}
