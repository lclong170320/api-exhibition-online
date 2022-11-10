import { Injectable } from '@nestjs/common';
import { Location as LocationDto } from '../dto/location.dto';
import { Location } from '../entities/location.entity';
import { SpaceTemplateLocationConverter } from './space-template-location.converter';

@Injectable()
export class LocationConverter {
    constructor(
        private readonly spaceTemplateLocationConverter: SpaceTemplateLocationConverter,
    ) {}
    toDto(entity: Location) {
        const dto = {
            id: entity.id,
            status: entity.status,
            space_template_location: this.spaceTemplateLocationConverter.toDto(
                entity.spaceTemplateLocation,
            ),
        } as LocationDto;
        return dto;
    }
}
