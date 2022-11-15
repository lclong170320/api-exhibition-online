import { SpaceTemplateLocation as SpaceTemplateLocationDto } from '@/components/exhibition/dto/space-template-location.dto';
import { SpaceTemplateLocation } from '@/components/exhibition/entities/space-template-location.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpaceTemplateLocationConverter {
    toEntity(dto: SpaceTemplateLocationDto) {
        const entity = new SpaceTemplateLocation();
        entity.name = dto.name;
        entity.positionX = dto.position_x;
        entity.positionY = dto.position_y;
        entity.positionZ = dto.position_z;
        entity.rotationX = dto.rotation_x;
        entity.rotationY = dto.rotation_y;
        entity.rotationZ = dto.rotation_z;
        return entity;
    }
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
