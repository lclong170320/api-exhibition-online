import { BoothOrganization as BoothOrganizationDto } from '@/components/exhibition/dto/booth-organization.dto';
import { BoothOrganization } from '@/components/exhibition/entities/booth-organization.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationDataConverter } from './booth-organization-data.converter';

@Injectable()
export class BoothOrganizationConverter {
    constructor(
        private readonly boothOrganizationDataConverter: BoothOrganizationDataConverter,
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
            booth_template_id: entity.boothTemplate?.id,
            booth_organization_data: entity.boothOrganizationData
                ? entity.boothOrganizationData.map((data) =>
                      this.boothOrganizationDataConverter.toDto(data),
                  )
                : undefined,
            exhibition_id: entity.exhibition?.id,
            user_id: entity.userId,
        } as BoothOrganizationDto;

        return dto;
    }
}
