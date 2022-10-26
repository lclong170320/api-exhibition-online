import { BoothTemplate as BoothTemplateDto } from '@/components/exhibition/dto/booth-template.dto';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationConverter } from './booth-organization.converter';
import { PositionBoothConverter } from './position-booth.converter';

@Injectable()
export class BoothTemplateConverter {
    constructor(
        private readonly positionBoothConverter: PositionBoothConverter,
        private readonly boothOrganizationConverter: BoothOrganizationConverter,
    ) {}

    toEntity(dto: BoothTemplateDto) {
        const entity = new BoothTemplate();
        entity.name = dto.name;
        entity.type = dto.type;
        return entity;
    }

    toDto(entity: BoothTemplate) {
        const dto = {
            id: entity.id,
            created_by: entity.createdBy,
            name: entity.name,
            type: entity.type,
            created_date: entity.createdDate.toISOString(),
            model_id: entity.modelId,
            thumbnail_id: entity.thumbnailId,
            position_booths: entity.positionBooth
                ? entity.positionBooth.map((data) =>
                      this.positionBoothConverter.toDto(data),
                  )
                : undefined,
            booth_organizations: entity.boothOrganizations
                ? entity.boothOrganizations.map((data) =>
                      this.boothOrganizationConverter.toDto(data),
                  )
                : undefined,
        } as BoothTemplateDto;

        return dto;
    }
}
