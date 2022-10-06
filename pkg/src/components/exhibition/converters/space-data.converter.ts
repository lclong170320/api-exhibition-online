import { SpaceData as SpaceDataDto } from '@/components/exhibition/dto/space-data.dto';
import { SpaceData } from '@/components/exhibition/entities/space-data.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpaceDataConverter {
    toDto(entity: SpaceData) {
        const dto = {
            id: entity.id,
            position_space_id: entity.positionSpace.id,
            media_id: entity.mediaId,
        } as SpaceDataDto;

        return dto;
    }
}
