import { BoothOrganizationTemplate as BoothOrganizationTemplateDto } from '@/components/exhibition/dto/booth-organization-template.dto';
import { BoothOrganizationTemplate } from '@/components/exhibition/entities/booth-organization-template.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationTemplatePositionConverter } from './booth-organization-template-position.converter';

@Injectable()
export class BoothOrganizationTemplateConverter {
    constructor(
        private readonly boothOrganizationTemplatePositionConverter: BoothOrganizationTemplatePositionConverter,
    ) {}

    toDto(entity: BoothOrganizationTemplate) {
        const dto = {
            id: entity.id,
            created_by: entity.createdBy,
            name: entity.name,
            created_date: entity.createdDate.toISOString(),
            model_id: entity.modelId,
            thumbnail_id: entity.thumbnailId,
            booth_organization_template_positions:
                entity.boothOrganizationTemplatePositions
                    ? entity.boothOrganizationTemplatePositions.map((data) =>
                          this.boothOrganizationTemplatePositionConverter.toDto(
                              data,
                          ),
                      )
                    : undefined,
        } as BoothOrganizationTemplateDto;

        return dto;
    }
}
