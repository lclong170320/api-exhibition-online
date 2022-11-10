import { BoothImage as BoothImageDto } from '@/components/exhibition/dto/booth-image.dto';
import { BoothImage } from '@/components/exhibition/entities/booth-image.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothImageConverter {
    toDto(entity: BoothImage) {
        const dto = {
            id: entity.id,
            image_id: entity.image?.id ?? undefined,
            booth_template_position: entity.boothTemplatePosition ?? undefined,
        } as BoothImageDto;

        return dto;
    }
}
