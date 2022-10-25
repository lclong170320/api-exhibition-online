import { BoothOrganizationData as BoothOrganizationDataDto } from '@/components/exhibition/dto/booth-organization-data.dto';
import { BoothOrganizationData } from '@/components/exhibition/entities/booth-organization-data.entity';
import { Injectable } from '@nestjs/common';
import { PositionBoothConverter } from './position-booth.converter';

@Injectable()
export class BoothOrganizationDataConverter {
    constructor(
        private readonly positionBoothConverter: PositionBoothConverter,
    ) {}
    toEntity(dto: BoothOrganizationDataDto) {
        const entity = new BoothOrganizationData();
        entity.title = dto.title;
        entity.description = dto.description;
        return entity;
    }

    toDto(entity: BoothOrganizationData) {
        const dto = {
            id: entity.id,
            position_booth: entity.positionBooth
                ? this.positionBoothConverter.toDto(entity.positionBooth)
                : undefined,
            media_id: entity.mediaId ?? undefined,
            title: entity.title ?? undefined,
            description: entity.description ?? undefined,
        } as BoothOrganizationDataDto;

        return dto;
    }
}
