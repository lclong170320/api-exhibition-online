import { BoothTemplate as BoothTemplateDto } from '@/components/exhibition/dto/booth-template.dto';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BoothTemplatePositionConverter } from './booth-template-position.converter';
import { BoothConverter } from './booth.converter';

@Injectable()
export class BoothTemplateConverter {
    constructor(
        private readonly boothTemplatePositionConverter: BoothTemplatePositionConverter,
        @Inject(forwardRef(() => BoothConverter))
        private readonly boothConverter: BoothConverter,
    ) {}

    toEntity(dto: BoothTemplateDto) {
        const entity = new BoothTemplate();
        entity.name = dto.name;
        entity.type = dto.type;
        return entity;
    }

    toDto(entity: BoothTemplate) {
        const dto = {
            id: entity.id,
            created_by: entity.createdBy ?? undefined,
            name: entity.name ?? undefined,
            type: entity.type ?? undefined,
            created_date: entity.createdDate
                ? entity.createdDate.toISOString()
                : undefined,
            model_id: entity.modelId ?? undefined,
            thumbnail_id: entity.thumbnailId ?? undefined,
            booth_template_positions: entity.boothTemplatePositions
                ? entity.boothTemplatePositions.map((data) =>
                      this.boothTemplatePositionConverter.toDto(data),
                  )
                : undefined,
            booths: entity.booths
                ? entity.booths.map((data) => this.boothConverter.toDto(data))
                : undefined,
        } as BoothTemplateDto;

        return dto;
    }
}
