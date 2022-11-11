import { SpaceImage as SpaceImageDto } from '@/components/exhibition/dto/space-image.dto';
import { SpaceImage } from '@/components/exhibition/entities/space-image.entity';
import { Injectable } from '@nestjs/common';
import { SpaceTemplatePositionConverter } from './space-template-position.converter';

@Injectable()
export class SpaceImageConverter {
    constructor(
        private readonly spaceTemplatePositionConverter: SpaceTemplatePositionConverter,
    ) {}
    toEntity(dto: SpaceImageDto) {
        const entity = new SpaceImage();
        entity.id = dto.id;
        return entity;
    }
    toDto(entity: SpaceImage) {
        const dto = {
            id: entity.id,
            image_id: entity.image?.id,
            space_template_position: entity.spaceTemplatePosition
                ? this.spaceTemplatePositionConverter.toDto(
                      entity.spaceTemplatePosition,
                  )
                : undefined,
        } as SpaceImageDto;

        return dto;
    }
}
