import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import { Injectable } from '@nestjs/common';
import { BoothTemplateConverter } from './booth-template.converter';
import { LiveStreamConverter } from './live-stream.converter';
import { LocationConverter } from './location.converter';
import { BoothImageConverter } from './booth-image.converter';
import { BoothVideoConverter } from './booth-video.converter';
import { BoothProjectConverter } from './booth-project.converter';
import { BoothProductConverter } from './booth-product.converter';

@Injectable()
export class BoothConverter {
    constructor(
        private readonly liveStreamConverter: LiveStreamConverter,
        private readonly locationConverter: LocationConverter,
        private readonly boothTemplateConverter: BoothTemplateConverter,
        private readonly boothImageConverter: BoothImageConverter,
        private readonly boothVideoConverter: BoothVideoConverter,
        private readonly boothProjectConverter: BoothProjectConverter,
        private readonly boothProductConverter: BoothProductConverter,
    ) {}

    toEntity(dto: BoothDto) {
        const entity = new Booth();
        entity.name = dto.name;
        return entity;
    }

    toDto(entity: Booth) {
        const dto = {
            id: entity.id,
            name: entity.name,
            created_by: entity.createdBy,
            enterprise_id: entity.enterpriseId,
            booth_template: entity.boothTemplate
                ? entity.boothTemplate
                : undefined,
            location: entity.location ? entity.location : undefined,
            live_streams: entity.liveStreams
                ? entity.liveStreams.map((data) =>
                      this.liveStreamConverter.toDto(data),
                  )
                : undefined,
            booth_images: entity.boothImages?.length
                ? entity.boothImages.map((data) =>
                      this.boothImageConverter.toDto(data),
                  )
                : undefined,
            booth_videos: entity.boothVideos?.length
                ? entity.boothVideos.map((data) =>
                      this.boothVideoConverter.toDto(data),
                  )
                : undefined,
            booth_projects: entity.boothProjects?.length
                ? entity.boothProjects.map((data) =>
                      this.boothProjectConverter.toDto(data),
                  )
                : undefined,
            booth_products: entity.boothProducts?.length
                ? entity.boothProducts.map((data) =>
                      this.boothProductConverter.toDto(data),
                  )
                : undefined,
        } as BoothDto;

        return dto;
    }
}
