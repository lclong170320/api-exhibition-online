import { Marker } from '@/components/exhibition/dto/marker.dto';
import { Marker as MarkerEnity } from '@/components/exhibition/entities/marker.entity';
import PositionConverter from './position.converter';

export default class MarkerConverter {
    static toDto(entity: MarkerEnity) {
        const dto: Marker = {
            media_id: entity.mediaId,
            position: PositionConverter.toDto(entity),
            destination: entity.destination,
            description: entity.description,
        };

        return dto;
    }
}
