import { Product as ProductDto } from '@/components/exhibition/dto/product.dto';
import { Product } from '@/components/exhibition/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { PositionBoothConverter } from './position-booth.converter';

@Injectable()
export class ProductConverter {
    constructor(
        private readonly positionBoothConverter: PositionBoothConverter,
    ) {}
    toEntity(dto: ProductDto) {
        const entity = new Product();
        entity.name = dto.name;
        entity.description = dto.description;
        entity.price = dto.price;
        entity.purchaseLink = dto.purchase_link;
        return entity;
    }

    toDto(entity: Product) {
        const dto = {
            id: entity.id,
            position_booth_id: entity.positionBooth?.id,
            media_id: entity.mediaId ?? undefined,
            name: entity.name,
            price: entity.price,
            purchase_link: entity.purchaseLink,
            description: entity.description,
        } as ProductDto;

        return dto;
    }
}
