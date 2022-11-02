import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import { Injectable } from '@nestjs/common';
import { BoothDataConverter } from './booth-data.converter';
import { LiveStreamConverter } from './live-stream.converter';
import { ProductConverter } from './product.converter';
import { ProjectConverter } from './project.converter';

@Injectable()
export class BoothConverter {
    constructor(
        private readonly boothDataConverter: BoothDataConverter,
        private readonly productConverter: ProductConverter,
        private readonly projectConverter: ProjectConverter,
        private readonly liveStreamConverter: LiveStreamConverter,
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
            booth_template_id: entity.boothTemplate?.id,
            location_status_id: entity.locationStatus?.id,
            booth_data: entity.boothData.length
                ? entity.boothData.map((data) =>
                      this.boothDataConverter.toDto(data),
                  )
                : undefined,
            live_streams: entity.liveStreams
                ? entity.liveStreams.map((data) =>
                      this.liveStreamConverter.toDto(data),
                  )
                : undefined,
            products: entity.products.length
                ? entity.products.map((data) =>
                      this.productConverter.toDto(data),
                  )
                : undefined,
            projects: entity.projects.length
                ? entity.projects.map((data) =>
                      this.projectConverter.toDto(data),
                  )
                : undefined,
        } as BoothDto;

        return dto;
    }
}
