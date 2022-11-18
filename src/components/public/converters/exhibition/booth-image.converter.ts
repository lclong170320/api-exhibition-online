import { BoothImage as BoothImageDto } from '@/components/exhibition/dto/booth-image.dto';
import { BoothImage } from '@/components/exhibition/entities/booth-image.entity';
import { UtilService } from '@/utils/helper/util.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothImageConverter {
    constructor(private readonly utilService: UtilService) {}
    async toDto(entity: BoothImage) {
        const url = await this.utilService.getMediaUrl(entity['image'].imageId);
        const dto = {
            id: entity.id,
            image_id: entity['image'].imageId ?? undefined,
            image_url: url ?? undefined,
            booth_template_position: entity.boothTemplatePosition ?? undefined,
        } as BoothImageDto;

        return dto;
    }
}
