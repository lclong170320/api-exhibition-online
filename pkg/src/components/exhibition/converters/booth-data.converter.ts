import { BoothData as BoothDataDto } from '@/components/exhibition/dto/booth-data.dto';
import { BoothData } from '@/components/exhibition/entities/booth-data.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothDataConverter {
    toEntity(dto: BoothDataDto) {
        const entity = new BoothData();
        entity.title = dto.title;
        entity.description = dto.description;
        return entity;
    }

    toDto(entity: BoothData) {
        const dto = {
            id: entity.id,
            position_booth_id: entity.positionBooth.id,
            media_id: entity.mediaId ?? undefined,
            title: entity.title ?? undefined,
            description: entity.description ?? undefined,
        } as BoothDataDto;

        return dto;
    }
}
