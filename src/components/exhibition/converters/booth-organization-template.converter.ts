import { BoothOrganizationTemplate as BoothOrganizationTemplateDto } from '@/components/exhibition/dto/booth-organization-template.dto';
import { BoothOrganizationTemplate } from '@/components/exhibition/entities/booth-organization-template.entity';
import { UtilService } from '@/utils/helper/util.service';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationTemplatePositionConverter } from './booth-organization-template-position.converter';

@Injectable()
export class BoothOrganizationTemplateConverter {
    constructor(
        private readonly boothOrganizationTemplatePositionConverter: BoothOrganizationTemplatePositionConverter,
        private utilService: UtilService,
    ) {}

    async toEntity(dto: BoothOrganizationTemplateDto, userId: number) {
        const entity = new BoothOrganizationTemplate();
        entity.name = dto.name;
        entity.createdBy = userId;
        entity.createdDate = new Date();
        entity.modelId = await this.utilService.createUrlMedias(dto.model_data);
        entity.thumbnailId = await this.utilService.createUrlMedias(
            dto.thumbnail_data,
        );
        return entity;
    }

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
