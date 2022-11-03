import { BoothData as BoothDataDto } from '@/components/exhibition/dto/booth-data.dto';
import { BoothData } from '@/components/exhibition/entities/booth-data.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothDataConverter {
    toDto(entity: BoothData) {
        const dto = {
            id: entity.id,
            position_booth_id: entity.positionBooth?.id,
            media_id: entity.mediaId ?? undefined,
        } as BoothDataDto;

        return dto;
    }
}
