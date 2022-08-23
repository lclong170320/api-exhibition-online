import { Position } from '@/components/exhibition/dto/position.dto';
import { Marker as MarkerEntity } from '@/components/exhibition/entities/marker.entity';

export default class PositionConverter {
    static toDto(entity: MarkerEntity) {
        const dto: Position = {
            x: entity.positionX,
            y: entity.positionY,
            z: entity.positionZ,
        };

        return dto;
    }
}
