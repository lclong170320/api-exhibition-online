import { Space as SpaceDto } from '@/components/exhibition/dto/space.dto';
import { Space } from '@/components/exhibition/entities/space.entity';
import { Injectable } from '@nestjs/common';
import { LocationConverter } from './location.converter';
import { SpaceImageConverter } from './space-image.converter';
import { SpaceTemplateConverter } from './space-template.converter';
import { SpaceVideoConverter } from './space-video.converter';

@Injectable()
export class SpaceConverter {
    constructor(
        private readonly spaceTemplateConverter: SpaceTemplateConverter,
        private readonly locationsConverter: LocationConverter,
        private readonly spaceImageConverter: SpaceImageConverter,
        private readonly spaceVideoConverter: SpaceVideoConverter,
    ) {}

    toDto(entity: Space) {
        const dto = {
            id: entity.id,
            name: entity.name,
            exhibition_id: entity.exhibition?.id,
            space_template: entity.spaceTemplate
                ? this.spaceTemplateConverter.toDto(entity.spaceTemplate)
                : undefined,
            space_images: entity.spaceImages?.map((data) =>
                this.spaceImageConverter.toDto(data),
            ),
            space_videos: entity.spaceVideos?.map((data) =>
                this.spaceVideoConverter.toDto(data),
            ),
            locations: entity.locations?.map((data) =>
                this.locationsConverter.toDto(data),
            ),
        } as SpaceDto;

        return dto;
    }
}
