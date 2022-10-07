import { BoothTemplate as BoothTemplateDto } from '@/components/exhibition/dto/booth-template.dto';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothTemplateConverter {
    toEntity(dto: BoothTemplateDto) {
        const entity = new BoothTemplate();
        entity.name = dto.name;
        entity.modelId = dto.model_id;
        entity.thumbnailId = dto.thumbnail_id;
        return entity;
    }

    toDto(entity: BoothTemplate) {
        const dto = {
            id: entity.id,
            name: entity.name,
            model_id: entity.modelId,
            thumbnail_id: entity.thumbnailId,
        } as BoothTemplateDto;

        return dto;
    }
}
