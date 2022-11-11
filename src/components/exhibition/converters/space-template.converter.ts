import { SpaceTemplate as SpaceTemplateDto } from '@/components/exhibition/dto/space-template.dto';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SpaceTemplateLocationConverter } from './space-template-location.converter';
// import { PositionSpaceConverter } from './position-space.converter';
import { SpaceTemplatePositionConverter } from './space-template-position.converter';
import { SpaceConverter } from './space.converter';

@Injectable()
export class SpaceTemplateConverter {
    constructor(
        private spaceTemplatePositionConverter: SpaceTemplatePositionConverter,
        private spaceTemplateLocationConverter: SpaceTemplateLocationConverter,
        @Inject(forwardRef(() => SpaceConverter))
        private spaceConverter: SpaceConverter,
    ) {}
    toDto(entity: SpaceTemplate) {
        const dto = {
            id: entity.id,
            name: entity.name,
            model_id: entity.modelId,
            thumbnail_id: entity.thumbnailId,
            created_by: entity.createdBy,
            map_id: entity.mapId,
            created_date: entity.createdDate.toISOString(),
            space_template_positions: entity.spaceTemplatePositions
                ? entity.spaceTemplatePositions.map((data) =>
                      this.spaceTemplatePositionConverter.toDto(data),
                  )
                : undefined,
            space_template_locations: entity.spaceTemplateLocations
                ? entity.spaceTemplateLocations.map((data) =>
                      this.spaceTemplateLocationConverter.toDto(data),
                  )
                : undefined,
            spaces: entity.spaces
                ? entity.spaces.map((data) => this.spaceConverter.toDto(data))
                : undefined,
        } as SpaceTemplateDto;

        return dto;
    }
}
