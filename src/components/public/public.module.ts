import { DbConnection } from '@/database/config/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { UtilService } from '@/utils/helper/util.service';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

// entities
import { SpaceTemplateLocation } from '@/components/exhibition/entities/space-template-location.entity';
import { BoothOrganization } from '@/components/exhibition/entities/booth-organization.entity';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import { Category } from '@/components/exhibition/entities/category.entity';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';
import { Location } from '@/components/exhibition/entities/location.entity';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { Space } from '@/components/exhibition/entities/space.entity';
import { Media } from '@/components/media/entities/media.entity';
import { BoothImage } from '@/components/exhibition/entities/booth-image.entity';
import { BoothVideo } from '@/components/exhibition/entities/booth-video.entity';
import { BoothProject } from '@/components/exhibition/entities/booth-project.entity';
import { BoothProduct } from '@/components/exhibition/entities/booth-product.entity';
import { LiveStream } from '@/components/exhibition/entities/live-stream.entity';
import { BoothOrganizationImage } from '@/components/exhibition/entities/booth-organization-image.entity';
import { BoothOrganizationProduct } from '@/components/exhibition/entities/booth-organization-product.entity';
import { BoothOrganizationProject } from '@/components/exhibition/entities/booth-organization-project.entity';
import { BoothOrganizationTemplatePosition } from '@/components/exhibition/entities/booth-organization-template-position.entity';
import { BoothOrganizationTemplate } from '@/components/exhibition/entities/booth-organization-template.entity';
import { BoothOrganizationVideo } from '@/components/exhibition/entities/booth-organization-video.entity';
import { BoothTemplatePosition } from '@/components/exhibition/entities/booth-template-position.entity';
import { Image } from '@/components/exhibition/entities/image.entity';
import { Product } from '@/components/exhibition/entities/product.entity';
import { Project } from '@/components/exhibition/entities/project.entity';
import { Video } from '@/components/exhibition/entities/video.entity';
import { SpaceTemplatePosition } from '../exhibition/entities/space-template-position.entity';
import { Enterprise } from '@/components/enterprise/entities/enterprise.entity';

// converter
import { PaginatedExhibitionsConverter } from '@/components/public/converters/exhibition/paginated-exhibitions.converter';
import { BoothTemplateConverter } from '@/components/public/converters/exhibition/booth-template.converter';
import { BoothConverter } from '@/components/public/converters/exhibition/booth.converter';
import CategoryConverter from '@/components/public/converters/exhibition/category.converter';
import { LiveStreamConverter } from '@/components/public/converters/exhibition/live-stream.converter';
import { LocationConverter } from '@/components/public/converters/exhibition/location.converter';
import { SpaceImageConverter } from '@/components/public/converters/exhibition/space-image.converter';
import { SpaceTemplateLocationConverter } from '@/components/public/converters/exhibition/space-template-location.converter';
import { SpaceTemplatePositionConverter } from '@/components/public/converters/exhibition/space-template-position.converter';
import { SpaceTemplateConverter } from '@/components/public/converters/exhibition/space-template.converter';
import { SpaceVideoConverter } from '@/components/public/converters/exhibition/space-video.converter';
import { SpaceConverter } from '@/components/public/converters/exhibition/space.converter';
import { BoothImageConverter } from '@/components/public/converters/exhibition/booth-image.converter';
import { BoothVideoConverter } from '@/components/public/converters/exhibition/booth-video.converter';
import { BoothProjectConverter } from '@/components/public/converters/exhibition/booth-project.converter';
import { BoothProductConverter } from '@/components/public/converters/exhibition/booth-product.converter';
import { BoothTemplatePositionConverter } from '@/components/public/converters/exhibition/booth-template-position.converter';
import { BoothOrganizationTemplatePositionConverter } from '@/components/public/converters/exhibition/booth-organization-template-position.converter';
import { BoothOrganizationConverter } from '@/components/public/converters/exhibition/booth-organization.converter';
import { BoothOrganizationImageConverter } from '@/components/public/converters/exhibition/booth-organization-image.converter';
import { BoothOrganizationVideoConverter } from '@/components/public/converters/exhibition/booth-organization-video.converter';
import { BoothOrganizationProductConverter } from '@/components/public/converters/exhibition/booth-organization-product.converter';
import { BoothOrganizationProjectConverter } from '@/components/public/converters/exhibition/booth-organization-project.converter';
import { BoothOrganizationTemplateConverter } from '@/components/public/converters/exhibition/booth-organization-template.converter';
import { EnterpriseConverter } from '@/components/public/converters/enterprise/enterprise.converter';
import { PaginatedEnterprisesConverter } from '@/components/public/converters/enterprise/paginated-enterprises.converter';
import { MediaConverter } from '@/components/public/converters/media/media.converter';
import { ExhibitionConverter } from '@/components/public/converters/exhibition/exhibition.converter';
import { PaginatedMeetingsConverter } from '@/components/public/converters/exhibition/paginated-meetings.converter';
import { PaginatedBoothTemplatesConverter } from '@/components/public/converters/exhibition/paginated-booth-templates.converter';
import { MeetingConverter } from './converters/exhibition/meeting.converter';
import { ConferenceTemplateConverter } from './converters/exhibition/conference-template.converter';
import { ConferenceImageConverter } from './converters/exhibition/conference-image.converter';
import { ConferenceVideoConverter } from './converters/exhibition/conference-video.converter';
import { ConferenceTemplatePositionConverter } from './converters/exhibition/conference-template-position.converter';
import { Conference } from '../exhibition/entities/conference.entity';
import { ConferenceTemplate } from '../exhibition/entities/conference-template.entity';
import { ConferenceTemplatePosition } from '../exhibition/entities/conference-template-position.entity';
import { ConferenceConverter } from './converters/exhibition/conference.converter';
import { CountProject } from '../exhibition/entities/count-project.entity';

@Module({
    controllers: [PublicController],
    providers: [
        PublicService,
        UtilService,
        ExhibitionConverter,
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
        PaginatedExhibitionsConverter,
        EnterpriseConverter,
        PaginatedEnterprisesConverter,
        BoothTemplatePositionConverter,
        JwtService,
        MediaConverter,
        MeetingConverter,
        PaginatedMeetingsConverter,
        ConferenceConverter,
        ConferenceTemplateConverter,
        ConferenceImageConverter,
        ConferenceVideoConverter,
        ConferenceTemplatePositionConverter,
        PaginatedBoothTemplatesConverter,
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
                Conference,
                ConferenceTemplate,
                ConferenceTemplatePosition,
                CountProject,
            ],
            DbConnection.exhibitionCon,
        ),
        TypeOrmModule.forFeature([Enterprise], DbConnection.enterpriseCon),
        TypeOrmModule.forFeature([Media], DbConnection.mediaCon),
        HttpModule,
    ],
    exports: [TypeOrmModule],
})
export class PublicModule {}
