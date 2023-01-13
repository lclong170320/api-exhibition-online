import { SpaceTemplatePosition as SpaceTemplatePositionDto } from '@/components/exhibition/dto/space-template-position.dto';
import {
    SpaceTemplatePosition,
    Type,
} from '@/components/exhibition/entities/space-template-position.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpaceTemplatePositionConverter {
    private checkType(type: Type) {
        if (!type) return;
        if (type === 'image') {
            return Type.IMAGE;
        }

        return Type.VIDEO;
    }
    toDto(entity: SpaceTemplatePosition) {
        const dto = {
            id: entity.id,
            position: entity.position ?? undefined,
            type: this.checkType(entity.type),
        } as SpaceTemplatePositionDto;

        return dto;
    }
}
