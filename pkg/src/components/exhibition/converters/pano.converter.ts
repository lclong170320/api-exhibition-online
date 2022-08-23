import { Pano } from '@/components/exhibition/dto/pano.dto';
import { Pano as PanoEntity } from '@/components/exhibition/entities/pano.entity';
import MarkerConverter from './marker.converter';

export default class PanoConverter {
    static toDto(entity: PanoEntity) {
        const dto: Pano = {
            media_id: entity.mediaId,
            markers: entity.markers.map((m) => MarkerConverter.toDto(m)),
        };

        return dto;
    }
}
