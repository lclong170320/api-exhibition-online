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
    async toDto(entity: Booth) {
        const dto = {
            id: entity.id,
            created_by: entity.createdBy,
            enterprise_id: entity.enterpriseId,
            created_date: entity.createdDate.toISOString(),
            booth_template: entity.boothTemplate
                ? this.boothTemplateConverter.toDto(entity.boothTemplate)
                : undefined,
            location: entity.location
                ? this.locationConverter.toDto(entity.location)
                : undefined,
            live_streams: entity.liveStreams
                ? entity.liveStreams.map((data) =>
                      this.liveStreamConverter.toDto(data),
                  )
                : undefined,
            booth_images: entity.boothImages?.length
                ? await Promise.all(
                      entity.boothImages.map(
                          async (data) =>
                              await this.boothImageConverter.toDto(data),
                      ),
                  )
                : undefined,
            booth_videos: entity.boothVideos?.length
                ? await Promise.all(
                      entity.boothVideos.map(
                          async (data) =>
                              await this.boothVideoConverter.toDto(data),
                      ),
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
