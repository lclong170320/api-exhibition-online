import { PaginatedBoothOrganizationTemplates as PaginatedBoothOrganizationTemplatesDto } from '@/components/exhibition/dto/paginated-booth-organization-templates.dto';
import { BoothOrganizationTemplate } from '@/components/exhibition/entities/booth-organization-template.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationTemplateConverter } from './booth-organization-template.converter';

@Injectable()
export class PaginatedBoothOrganizationTemplatesConverter {
    constructor(
        private boothOrganizationTemplateConverter: BoothOrganizationTemplateConverter,
    ) {}
    toDto(
        page: number,
        limit: number,
        total: number,
        entity: BoothOrganizationTemplate[],
    ) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            booth_organization_templates: entity.map((data) =>
                this.boothOrganizationTemplateConverter.toDto(data),
            ),
        } as PaginatedBoothOrganizationTemplatesDto;

        return dto;
    }
}
