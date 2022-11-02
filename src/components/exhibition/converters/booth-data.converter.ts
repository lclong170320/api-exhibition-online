import { BoothData as BoothDataDto } from '@/components/exhibition/dto/booth-data.dto';
import { BoothData } from '@/components/exhibition/entities/booth-data.entity';
import { Injectable } from '@nestjs/common';
import { PositionBoothConverter } from './position-booth.converter';

@Injectable()
export class BoothDataConverter {
    constructor(
        private readonly positionBoothConverter: PositionBoothConverter,
    ) {}

    toDto(entity: BoothData) {
        const dto = {
            id: entity.id,
            position_booth_id: entity.positionBooth?.id,
            media_id: entity.mediaId ?? undefined,
        } as BoothDataDto;

        return dto;
    }
}
