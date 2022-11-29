import { PaginatedConferenceTemplates as PaginatedConferenceTemplatesDto } from '@/components/exhibition/dto/paginated-conference-templates.dto';
import { ConferenceTemplate } from '@/components/exhibition/entities/conference-template.entity';
import { Injectable } from '@nestjs/common';
import { ConferenceTemplateConverter } from './conference-template.converter';

@Injectable()
export class PaginatedConferenceTemplatesConverter {
    constructor(
        private conferenceTemplateConverter: ConferenceTemplateConverter,
    ) {}
    toDto(
        page: number,
        limit: number,
        total: number,
        entity: ConferenceTemplate[],
    ) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            conference_templates: entity.map((data) =>
                this.conferenceTemplateConverter.toDto(data),
            ),
        } as PaginatedConferenceTemplatesDto;

        return dto;
    }
}
