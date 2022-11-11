import { BoothOrganizationProject as BoothOrganizationProjectDto } from '@/components/exhibition/dto/booth-organization-project.dto';
import { BoothOrganizationProject } from '../entities/booth-organization-project.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationTemplatePositionConverter } from './booth-organization-template-position.converter';

@Injectable()
export class BoothOrganizationProjectConverter {
    constructor(
        private readonly boothOrganizationTemplatePositionConverter: BoothOrganizationTemplatePositionConverter,
    ) {}
    toDto(entity: BoothOrganizationProject) {
        const dto = {
            id: entity.id,
            image_id: entity.project.imageId ?? undefined,
            title: entity.project.title,
            description: entity.project.description,
            booth_organization_template_position:
                entity.boothOrganizationTemplatePosition
                    ? this.boothOrganizationTemplatePositionConverter.toDto(
                          entity.boothOrganizationTemplatePosition,
                      )
                    : undefined,
        } as BoothOrganizationProjectDto;

        return dto;
    }
}
