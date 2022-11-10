import { Injectable } from '@nestjs/common';
import { SpaceTemplateLocation as SpaceTemplateLocationDto } from '../dto/space-template-location.dto';
import { SpaceTemplateLocation } from '../entities/space-template-location.entity';

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
