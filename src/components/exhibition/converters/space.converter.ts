import { Space as SpaceDto } from '@/components/exhibition/dto/space.dto';
import { Space } from '@/components/exhibition/entities/space.entity';
import { Injectable } from '@nestjs/common';
import { SpaceDataConverter } from './space-data.converter';

@Injectable()
export class SpaceConverter {
    constructor(private spaceDataConverter: SpaceDataConverter) {}

    toDto(entity: Space) {
        const dto = {
            id: entity.id,
            name: entity.name,
            user_id: entity.userId,
            exhibition_id: entity.exhibition?.id,
            space_template_id: entity.spaceTemplate?.id,
            spaceDatas: entity.spaceDatas
                ? entity.spaceDatas.map((data) =>
                      this.spaceDataConverter.toDto(data),
                  )
                : undefined,
        } as SpaceDto;

        return dto;
    }
}
