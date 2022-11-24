import { BoothOrganizationProduct as BoothOrganizationProductDto } from '@/components/exhibition/dto/booth-organization-product.dto';
import { BoothOrganizationProduct } from '../entities/booth-organization-product.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationTemplatePositionConverter } from './booth-organization-template-position.converter';

@Injectable()
export class BoothOrganizationProductConverter {
    constructor(
        private readonly boothOrganizationTemplatePositionConverter: BoothOrganizationTemplatePositionConverter,
    ) {}
    toDto(entity: BoothOrganizationProduct) {
        const dto = {
            id: entity.id,
            name: entity.product.name ?? undefined,
            image_id: entity.product.imageId ?? undefined,
            price: entity.product.price ?? undefined,
            purchase_link: entity.product.purchaseLink ?? undefined,
            description: entity.product.description ?? undefined,
            booth_organization_template_position:
                entity.boothOrganizationTemplatePosition
                    ? this.boothOrganizationTemplatePositionConverter.toDto(
                          entity.boothOrganizationTemplatePosition,
                      )
                    : undefined,
        } as BoothOrganizationProductDto;

        return dto;
    }
}
