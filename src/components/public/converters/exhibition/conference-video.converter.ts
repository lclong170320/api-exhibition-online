import { ConferenceVideo as ConferenceVideoDto } from '@/components/exhibition/dto/conference-video.dto';
import { ConferenceVideo } from '@/components/exhibition/entities/conference-video.entity';
import { Injectable } from '@nestjs/common';
import { ConferenceTemplatePositionConverter } from './conference-template-position.converter';

@Injectable()
export class ConferenceVideoConverter {
    constructor(
        private readonly conferenceTemplatePositionConverter: ConferenceTemplatePositionConverter,
    ) {}
    toEntity(dto: ConferenceVideoDto) {
        const entity = new ConferenceVideo();
        entity.id = dto.id;
        return entity;
    }
    toDto(entity: ConferenceVideo) {
        const dto = {
            id: entity.id,
            video_id: entity.video?.videoId ?? undefined,
            conference_template_position: entity.conferenceTemplatePosition
                ? this.conferenceTemplatePositionConverter.toDto(
                      entity.conferenceTemplatePosition,
                  )
                : undefined,
        } as ConferenceVideoDto;

        return dto;
    }
}
