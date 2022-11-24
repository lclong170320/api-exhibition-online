import { BoothTemplatePosition as BoothTemplatePositionDto } from '@/components/exhibition/dto/booth-template-position.dto';
import { BoothTemplatePosition } from '@/components/exhibition/entities/booth-template-position.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothTemplatePositionConverter {
    toDto(entity: BoothTemplatePosition) {
        const dto = {
            id: entity.id,
            type: entity.type,
            position: entity.position,
        } as BoothTemplatePositionDto;

        return dto;
    }

    toEntity(dto: BoothTemplatePositionDto) {
        const entity = new BoothTemplatePosition();
        entity.type = dto.type ?? undefined;
        entity.position = dto.position ?? undefined;
        return entity;
    }
}
