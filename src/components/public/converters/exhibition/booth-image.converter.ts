import { BoothImage as BoothImageDto } from '@/components/exhibition/dto/booth-image.dto';
import { BoothImage } from '@/components/exhibition/entities/booth-image.entity';
import { Injectable } from '@nestjs/common';
import { MediaClientService } from 'clients/media.client';

@Injectable()
export class BoothImageConverter {
    constructor(private readonly mediaClientService: MediaClientService) {}
    async toDto(entity: BoothImage) {
        const url = await this.mediaClientService.getMediaUrl(
            entity['image'].imageId,
        );
        const dto = {
            id: entity.id,
            image_id: entity['image'].imageId ?? undefined,
            image_url: url ?? undefined,
            booth_template_position: entity.boothTemplatePosition ?? undefined,
        } as BoothImageDto;

        return dto;
    }
}
