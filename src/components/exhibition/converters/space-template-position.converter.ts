import { SpaceTemplatePosition as SpaceTemplatePositionDto } from '@/components/exhibition/dto/space-template-position.dto';
import { SpaceTemplatePosition } from '@/components/exhibition/entities/space-template-position.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpaceTemplatePositionConverter {
    toDto(entity: SpaceTemplatePosition) {
        const dto = {
            id: entity.id,
            position: entity.position ?? undefined,
            type: entity.type
                ? entity.type === 'image'
                    ? 'image'
                    : 'video'
                : undefined,
        } as SpaceTemplatePositionDto;

        return dto;
    }
}
