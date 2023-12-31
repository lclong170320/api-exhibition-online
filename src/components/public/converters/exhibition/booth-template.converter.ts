import { BoothTemplate as BoothTemplateDto } from '@/components/exhibition/dto/booth-template.dto';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { Injectable } from '@nestjs/common';
import { BoothTemplatePositionConverter } from './booth-template-position.converter';

@Injectable()
export class BoothTemplateConverter {
    constructor(
        private readonly boothTemplatePositionConverter: BoothTemplatePositionConverter,
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
            created_by: entity.createdBy,
            name: entity.name,
            type: entity.type,
            created_date: entity.createdDate.toISOString(),
            model_id: entity.modelId,
            thumbnail_id: entity.thumbnailId,
            booth_template_positions: entity.boothTemplatePositions
                ? entity.boothTemplatePositions.map((data) =>
                      this.boothTemplatePositionConverter.toDto(data),
                  )
                : undefined,
        } as BoothTemplateDto;

        return dto;
    }
}
