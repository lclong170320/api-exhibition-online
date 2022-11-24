import { ConferenceTemplatePosition as ConferenceTemplatePositionDto } from '@/components/exhibition/dto/conference-template-position.dto';
import { ConferenceTemplatePosition } from '@/components/exhibition/entities/conference-template-position.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConferenceTemplatePositionConverter {
    toDto(entity: ConferenceTemplatePosition) {
        const dto = {
            id: entity.id,
            type: entity.type,
            position: entity.position,
        } as ConferenceTemplatePositionDto;

        return dto;
    }

    toEntity(dto: ConferenceTemplatePositionDto) {
        const entity = new ConferenceTemplatePosition();
        entity.type = dto.type;
        entity.position = dto.position;
        return entity;
    }
}
