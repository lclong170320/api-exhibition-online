import { ConferenceTemplate as ConferenceTemplateDto } from '@/components/exhibition/dto/conference-template.dto';
import { ConferenceTemplate } from '@/components/exhibition/entities/conference-template.entity';
import { Injectable } from '@nestjs/common';
import { ConferenceTemplatePositionConverter } from './conference-template-position.converter';

@Injectable()
export class ConferenceTemplateConverter {
    constructor(
        private readonly conferenceTemplatePositionConverter: ConferenceTemplatePositionConverter,
    ) {}

    toEntity(dto: ConferenceTemplateDto) {
        const entity = new ConferenceTemplate();
        entity.name = dto.name;
        return entity;
    }

    toDto(entity: ConferenceTemplate) {
        const dto = {
            id: entity.id,
            created_by: entity.createdBy,
            name: entity.name,
            created_date: entity.createdDate.toISOString(),
            model_id: entity.modelId,
            thumbnail_id: entity.thumbnailId,
            conference_template_positions: entity.conferenceTemplatePositions
                ? entity.conferenceTemplatePositions.map((data) =>
                      this.conferenceTemplatePositionConverter.toDto(data),
                  )
                : undefined,
        } as ConferenceTemplateDto;

        return dto;
    }
}
