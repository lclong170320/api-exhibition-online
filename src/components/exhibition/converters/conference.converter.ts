import { Conference as ConferenceDto } from '@/components/exhibition/dto/conference.dto';
import { Conference } from '@/components/exhibition/entities/conference.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConferenceImageConverter } from './conference-image.converter';
import { ConferenceTemplateConverter } from './conference-template.converter';
import { ConferenceVideoConverter } from './conference-video.converter';

@Injectable()
export class ConferenceConverter {
    constructor(
        @Inject(forwardRef(() => ConferenceTemplateConverter))
        private readonly conferenceTemplateConverter: ConferenceTemplateConverter,
        private readonly conferenceImageConverter: ConferenceImageConverter,
        private readonly conferenceVideoConverter: ConferenceVideoConverter,
    ) {}

    toDto(entity: Conference) {
        const dto = {
            id: entity.id,
            name: entity.name ?? undefined,
            exhibition_id: entity.exhibition?.id ?? undefined,
            conference_template: entity.conferenceTemplate
                ? this.conferenceTemplateConverter.toDto(
                      entity.conferenceTemplate,
                  )
                : undefined,
            conference_images:
                entity.conferenceImages?.map((data) =>
                    this.conferenceImageConverter.toDto(data),
                ) ?? undefined,
            conference_videos:
                entity.conferenceVideos?.map((data) =>
                    this.conferenceVideoConverter.toDto(data),
                ) ?? undefined,
        } as ConferenceDto;

        return dto;
    }
}
