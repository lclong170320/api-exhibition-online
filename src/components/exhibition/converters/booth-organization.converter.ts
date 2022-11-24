import { Injectable } from '@nestjs/common';
import { BoothOrganization as BoothOrganizationDto } from '@/components/exhibition/dto/booth-organization.dto';
import { BoothOrganization } from '@/components/exhibition/entities/booth-organization.entity';
import { BoothOrganizationImageConverter } from './booth-organization-image.converter';
import { BoothOrganizationVideoConverter } from './booth-organization-video.converter';
import { BoothOrganizationProjectConverter } from './booth-organization-project.converter';
import { BoothOrganizationProductConverter } from './booth-organization-product.converter';
import { BoothOrganizationTemplateConverter } from './booth-organization-template.converter';

@Injectable()
export class BoothOrganizationConverter {
    constructor(
        private readonly boothOrganizationImageConverter: BoothOrganizationImageConverter,
        private readonly boothOrganizationVideoConverter: BoothOrganizationVideoConverter,
        private readonly boothOrganizationProjectConverter: BoothOrganizationProjectConverter,
        private readonly boothOrganizationProductConverter: BoothOrganizationProductConverter,
        private readonly boothOrganizationTemplateConverter: BoothOrganizationTemplateConverter,
    ) {}

    toEntity(dto: BoothOrganizationDto) {
        const entity = new BoothOrganization();
        entity.positionX = dto.position_x;
        entity.positionY = dto.position_y;
        entity.positionZ = dto.position_z;
        entity.rotationX = dto.rotation_x;
        entity.rotationY = dto.rotation_y;
        entity.rotationZ = dto.rotation_z;
        return entity;
    }

    toDto(entity: BoothOrganization) {
        const dto = {
            id: entity.id,
            position_x: entity.positionX ?? undefined,
            position_y: entity.positionY ?? undefined,
            position_z: entity.positionZ ?? undefined,
            rotation_x: entity.rotationX ?? undefined,
            rotation_y: entity.rotationY ?? undefined,
            rotation_z: entity.rotationZ ?? undefined,
            booth_organization_template: entity.boothOrganizationTemplate
                ? this.boothOrganizationTemplateConverter.toDto(
                      entity.boothOrganizationTemplate,
                  )
                : undefined,
            booth_organization_images: entity.boothOrganizationImages
                ? entity.boothOrganizationImages.map((data) =>
                      this.boothOrganizationImageConverter.toDto(data),
                  )
                : undefined,
            booth_organization_videos: entity.boothOrganizationVideos
                ? entity.boothOrganizationVideos.map((data) =>
                      this.boothOrganizationVideoConverter.toDto(data),
                  )
                : undefined,
            booth_organization_projects: entity.boothOrganizationProjects
                ? entity.boothOrganizationProjects.map((data) =>
                      this.boothOrganizationProjectConverter.toDto(data),
                  )
                : undefined,
            booth_organization_products: entity.boothOrganizationProducts
                ? entity.boothOrganizationProducts.map((data) =>
                      this.boothOrganizationProductConverter.toDto(data),
                  )
                : undefined,
        } as BoothOrganizationDto;

        return dto;
    }
}
