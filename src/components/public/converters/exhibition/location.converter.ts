import { Injectable } from '@nestjs/common';
import { Location as LocationDto } from '@/components/exhibition/dto/location.dto';
import { Location } from '@/components/exhibition/entities/location.entity';
import { SpaceTemplateLocationConverter } from './space-template-location.converter';
export enum Status {
    AVAILABLE = 'available',
    RESERVED = 'reserved',
}
@Injectable()
export class LocationConverter {
    constructor(
        private spaceTemplateLocationConverter: SpaceTemplateLocationConverter,
    ) {}
    toEntity(dto: LocationDto) {
        const entity = new Location();
        entity.id = dto.id;
        entity.status =
            dto.status === Status.AVAILABLE
                ? Status.AVAILABLE
                : Status.RESERVED;
        return entity;
    }
    toDto(entity: Location) {
        const dto = {
            id: entity.id,
            status:
                entity.status === Status.AVAILABLE
                    ? Status.AVAILABLE
                    : Status.RESERVED,
            space_template_location: entity.spaceTemplateLocation
                ? this.spaceTemplateLocationConverter.toDto(
                      entity.spaceTemplateLocation,
                  )
                : undefined,
        } as LocationDto;
        return dto;
    }
}
