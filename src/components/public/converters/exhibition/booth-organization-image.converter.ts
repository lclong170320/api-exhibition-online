import { BoothOrganizationImage as BoothOrganizationImageDto } from '@/components/exhibition/dto/booth-organization-image.dto';
import { BoothOrganizationImage } from '@/components/exhibition/entities/booth-organization-image.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationTemplatePositionConverter } from './booth-organization-template-position.converter';

@Injectable()
export class BoothOrganizationImageConverter {
    constructor(
        private readonly boothOrganizationTemplatePositionConverter: BoothOrganizationTemplatePositionConverter,
    ) {}
    toDto(entity: BoothOrganizationImage) {
        const dto = {
            id: entity.id,
            image_id: entity.image?.imageId ?? undefined,
            booth_organization_template_position:
                entity.boothOrganizationTemplatePosition
                    ? this.boothOrganizationTemplatePositionConverter.toDto(
                          entity.boothOrganizationTemplatePosition,
                      )
                    : undefined,
        } as BoothOrganizationImageDto;

        return dto;
    }
}
