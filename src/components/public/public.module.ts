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
import { LocationStatusConverter } from '../exhibition/converters/location-status.converter';
import { PositionBoothConverter } from '../exhibition/converters/position-booth.converter';
import { PositionSpaceConverter } from '../exhibition/converters/position-space.converter';
import { ProductConverter } from '../exhibition/converters/product.converter';
import { ProjectConverter } from '../exhibition/converters/project.converter';
import { SpaceDataConverter } from '../exhibition/converters/space-data.converter';
import { SpaceTemplateConverter } from '../exhibition/converters/space-template.converter';
import { SpaceConverter } from '../exhibition/converters/space.converter';
import { BoothLocation } from '../exhibition/entities/booth-location.entity';
import { BoothOrganizationData } from '../exhibition/entities/booth-organization-data.entity';
import { BoothOrganization } from '../exhibition/entities/booth-organization.entity';
import { BoothTemplate } from '../exhibition/entities/booth-template.entity';
import { Booth } from '../exhibition/entities/booth.entity';
import { Category } from '../exhibition/entities/category.entity';
import { Exhibition } from '../exhibition/entities/exhibition.entity';
import { LocationStatus } from '../exhibition/entities/location-status.entity';
import { PositionBooth } from '../exhibition/entities/position-booth.entity';
import { PositionSpace } from '../exhibition/entities/position-space.entity';
import { SpaceData } from '../exhibition/entities/space-data.entity';
import { SpaceTemplate } from '../exhibition/entities/space-template.entity';
import { Space } from '../exhibition/entities/space.entity';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

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
        ProductConverter,
        ProjectConverter,
        LiveStreamConverter,
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
            ],
            DbConnection.exhibitionCon,
        ),
    ],
    exports: [TypeOrmModule],
})
export class PublicModule {}
