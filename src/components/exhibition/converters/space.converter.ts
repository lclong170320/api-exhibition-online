import { Space as SpaceDto } from '@/components/exhibition/dto/space.dto';
import { Space } from '@/components/exhibition/entities/space.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SpaceDataConverter } from './space-data.converter';
import { SpaceTemplateConverter } from './space-template.converter';

@Injectable()
export class SpaceConverter {
    constructor(
        private readonly spaceDataConverter: SpaceDataConverter,
        @Inject(forwardRef(() => SpaceTemplateConverter))
        private readonly spaceTemplateConverter: SpaceTemplateConverter,
    ) {}

    toDto(entity: Space) {
        const dto = {
            id: entity.id,
            name: entity.name,
            exhibition_id: entity.exhibition?.id,
            space_template_id: entity.spaceTemplate?.id,
            space_template: entity.spaceTemplate
                ? this.spaceTemplateConverter.toDto(entity.spaceTemplate)
                : undefined,
            space_datas: entity.spaceDatas
                ? entity.spaceDatas.map((data) =>
                      this.spaceDataConverter.toDto(data),
                  )
                : undefined,
        } as SpaceDto;

        return dto;
    }
}
