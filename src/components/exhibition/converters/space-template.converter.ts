import { SpaceTemplate as SpaceTemplateDto } from '@/components/exhibition/dto/space-template.dto';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { Injectable } from '@nestjs/common';
import { PositionSpaceConverter } from './position-space.converter';
import { SpaceConverter } from './space.converter';

@Injectable()
export class SpaceTemplateConverter {
    constructor(
        private positionSpaceConverter: PositionSpaceConverter,
        private spaceConverter: SpaceConverter,
    ) {}
    toDto(entity: SpaceTemplate) {
        const dto = {
            id: entity.id,
            name: entity.name,
            model_id: entity.modelId,
            thumbnail_id: entity.thumbnailId,
            exhibition_map_id: entity.exhibitionMapId,
            position_spaces: entity.positionSpaces
                ? entity.positionSpaces.map((data) =>
                      this.positionSpaceConverter.toDto(data),
                  )
                : undefined,
            spaces: entity.spaces
                ? entity.spaces.map((data) => this.spaceConverter.toDto(data))
                : undefined,
        } as SpaceTemplateDto;

        return dto;
    }
}
