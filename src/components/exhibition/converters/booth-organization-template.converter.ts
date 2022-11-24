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
            created_by: entity.createdBy ?? undefined,
            name: entity.name ?? undefined,
            created_date: entity.createdDate
                ? entity.createdDate.toISOString()
                : undefined,
            model_id: entity.modelId ?? undefined,
            thumbnail_id: entity.thumbnailId ?? undefined,
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
