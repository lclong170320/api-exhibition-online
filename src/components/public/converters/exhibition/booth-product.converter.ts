import { BoothProduct as BoothProductDto } from '@/components/exhibition/dto/booth-product.dto';
import { BoothProduct } from '@/components/exhibition/entities/booth-product.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothProductConverter {
    toDto(entity: BoothProduct) {
        const dto = {
            id: entity.id,
            name: entity.product?.name ?? undefined,
            price: entity.product?.price ?? undefined,
            purchase_link: entity.product?.purchaseLink ?? undefined,
            description: entity.product?.description ?? undefined,
            image_id: entity.product?.imageId ?? undefined,
            booth_template_position: entity.boothTemplatePosition ?? undefined,
        } as BoothProductDto;

        return dto;
    }
}
