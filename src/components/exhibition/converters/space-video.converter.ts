import { SpaceVideo as SpaceVideoDto } from '@/components/exhibition/dto/space-video.dto';
import { SpaceVideo } from '@/components/exhibition/entities/space-video.entity';
import { Injectable } from '@nestjs/common';
import { SpaceTemplatePositionConverter } from './space-template-position.converter';

@Injectable()
export class SpaceVideoConverter {
    constructor(
        private readonly spaceTemplatePositionConverter: SpaceTemplatePositionConverter,
    ) {}
    toEntity(dto: SpaceVideoDto) {
        const entity = new SpaceVideo();
        entity.id = dto.id;
        return entity;
    }
    toDto(entity: SpaceVideo) {
        const dto = {
            id: entity.id,
            video_id: entity.video?.videoId,
            space_template_position: entity.spaceTemplatePosition
                ? this.spaceTemplatePositionConverter.toDto(
                      entity.spaceTemplatePosition,
                  )
                : undefined,
        } as SpaceVideoDto;

        return dto;
    }
}
