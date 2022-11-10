import { BoothOrganization as BoothOrganizationDto } from '@/components/exhibition/dto/booth-organization.dto';
import { BoothOrganization } from '@/components/exhibition/entities/booth-organization.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BoothOrganizationDataConverter } from './booth-organization-data.converter';
import { BoothTemplateConverter } from './booth-template.converter';

@Injectable()
export class BoothOrganizationConverter {
    constructor(
        private readonly boothOrganizationDataConverter: BoothOrganizationDataConverter,
        @Inject(forwardRef(() => BoothTemplateConverter))
        private readonly boothTemplateConverter: BoothTemplateConverter,
    ) {}

    toEntity(dto: BoothOrganizationDto) {
        const entity = new BoothOrganization();
        entity.name = dto.name;
        entity.boothOrganizationData = dto.booth_organization_data.map((data) =>
            this.boothOrganizationDataConverter.toEntity(data),
        );
        return entity;
    }

    toDto(entity: BoothOrganization) {
        const dto = {
            id: entity.id,
            name: entity.name,
            exhibition_id: entity.exhibition?.id,
            user_id: entity.userId,
        } as BoothOrganizationDto;

        return dto;
    }
}
