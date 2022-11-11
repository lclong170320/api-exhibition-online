import { SpaceTemplateLocation as SpaceTemplateLocationDto } from '@/components/exhibition/dto/space-template-location.dto';
import { SpaceTemplateLocation } from '@/components/exhibition/entities/space-template-location.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpaceTemplateLocationConverter {
    toDto(entity: SpaceTemplateLocation) {
        const dto = {
            id: entity.id,
            name: entity.name,
            position_x: entity.positionX,
            position_y: entity.positionY,
            position_z: entity.positionZ,
            rotation_x: entity.rotationX,
            rotation_y: entity.rotationY,
            rotation_z: entity.rotationZ,
        } as SpaceTemplateLocationDto;
        return dto;
    }
}
