import { BoothVideo as BoothVideoDto } from '@/components/exhibition/dto/booth-video.dto';
import { BoothVideo } from '@/components/exhibition/entities/booth-video.entity';
import { Injectable } from '@nestjs/common';
import { MediaClientService } from 'clients/media.client';

@Injectable()
export class BoothVideoConverter {
    constructor(private readonly mediaClientService: MediaClientService) {}
    async toDto(entity: BoothVideo) {
        const url = await this.mediaClientService.getMediaUrl(
            entity['video'].videoId,
        );
        const dto = {
            id: entity.id,
            video_id: entity['video'].videoId ?? undefined,
            video_url: url ?? undefined,
            booth_template_position: entity.boothTemplatePosition ?? undefined,
        } as BoothVideoDto;
        return dto;
    }
}
