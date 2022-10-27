import { PositionBooth as PositionBoothDto } from '@/components/exhibition/dto/position-booth.dto';
import { PositionBooth } from '@/components/exhibition/entities/position-booth.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PositionBoothConverter {
    toEntity(dto: PositionBoothDto) {
        const entity = new PositionBooth();
        entity.object3dId = dto.object_3d_id;
        entity.type = dto.type;
        return entity;
    }

    toDto(entity: PositionBooth) {
        const dto = {
            id: entity.id,
            object_3d_id: entity.object3dId,
            type: entity.type,
        } as PositionBoothDto;

        return dto;
    }
}
