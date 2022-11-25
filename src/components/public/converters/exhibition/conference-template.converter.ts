import { ConferenceTemplate as ConferenceTemplateDto } from '@/components/exhibition/dto/conference-template.dto';
import { ConferenceTemplate } from '@/components/exhibition/entities/conference-template.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConferenceTemplatePositionConverter } from './conference-template-position.converter';
import { ConferenceConverter } from './conference.converter';

@Injectable()
export class ConferenceTemplateConverter {
    constructor(
        private readonly conferenceTemplatePositionConverter: ConferenceTemplatePositionConverter,
        @Inject(forwardRef(() => ConferenceConverter))
        private readonly conferenceConverter: ConferenceConverter,
    ) {}

    toEntity(dto: ConferenceTemplateDto) {
        const entity = new ConferenceTemplate();
        entity.name = dto.name;
        return entity;
    }

    toDto(entity: ConferenceTemplate) {
        const dto = {
            id: entity.id,
            created_by: entity.createdBy ?? undefined,
            name: entity.name ?? undefined,
            created_date: entity.createdDate.toISOString() ?? undefined,
            model_id: entity.modelId ?? undefined,
            thumbnail_id: entity.thumbnailId ?? undefined,
            conference_template_positions: entity.conferenceTemplatePositions
                ? entity.conferenceTemplatePositions.map((data) =>
                      this.conferenceTemplatePositionConverter.toDto(data),
                  )
                : undefined,
            conferences: entity.conferences
                ? entity.conferences.map((data) =>
                      this.conferenceConverter.toDto(data),
                  )
                : undefined,
        } as ConferenceTemplateDto;

        return dto;
    }
}
