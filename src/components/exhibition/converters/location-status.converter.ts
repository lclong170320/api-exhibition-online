import { Injectable } from '@nestjs/common';
import { Location } from '../dto/location.dto';
import { LocationStatus } from '../entities/location-status.entity';

@Injectable()
export class LocationStatusConverter {
    toDto(entity: LocationStatus) {
        const dto = {
            id: entity.id,
            name: entity.name,
            position_x: entity.positionX,
            position_y: entity.positionY,
            position_z: entity.positionZ,
            rotation_x: entity.rotationX,
            rotation_y: entity.rotationY,
            rotation_z: entity.rotationZ,
        } as Location;
        return dto;
    }
}
