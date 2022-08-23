import { Exhibition } from '@/components/exhibition/dto/exhibition.dto';
import { Exhibition as ExhibitionEntity } from '@/components/exhibition/entities/exhibition.entity';
import PanoConverter from './pano.converter';

export default class ExhibitionConverter {
    static toDto(entity: ExhibitionEntity) {
        const dto = {
            id: entity.id,
            panos: entity.panos.map((p) => PanoConverter.toDto(p)),
        } as Exhibition;

        return dto;
    }
}
