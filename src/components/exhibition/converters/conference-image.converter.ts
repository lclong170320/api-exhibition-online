import { ConferenceImage as ConferenceImageDto } from '@/components/exhibition/dto/conference-image.dto';
import { ConferenceImage } from '@/components/exhibition/entities/conference-image.entity';
import { Injectable } from '@nestjs/common';
import { ConferenceTemplatePositionConverter } from './conference-template-position.converter';

@Injectable()
export class ConferenceImageConverter {
    constructor(
        private readonly conferenceTemplatePositionConverter: ConferenceTemplatePositionConverter,
    ) {}
    toEntity(dto: ConferenceImageDto) {
        const entity = new ConferenceImage();
        entity.id = dto.id;
        return entity;
    }
    toDto(entity: ConferenceImage) {
        const dto = {
            id: entity.id,
            image_id: entity.image?.imageId ?? undefined,
            conference_template_position: entity.conferenceTemplatePosition
                ? this.conferenceTemplatePositionConverter.toDto(
                      entity.conferenceTemplatePosition,
                  )
                : undefined,
        } as ConferenceImageDto;

        return dto;
    }
}
