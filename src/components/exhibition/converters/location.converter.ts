import { Injectable } from '@nestjs/common';
import { Location as LocationDto } from '../dto/location.dto';
import { Location } from '../entities/location.entity';
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

    private checkStatus(status: Status) {
        if (!status) return;
        if (status === Status.AVAILABLE) {
            return Status.AVAILABLE;
        }

        return Status.RESERVED;
    }
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
            status: this.checkStatus(entity.status),
            space_template_location: entity.spaceTemplateLocation
                ? this.spaceTemplateLocationConverter.toDto(
                      entity.spaceTemplateLocation,
                  )
                : undefined,
        } as LocationDto;
        return dto;
    }
}
