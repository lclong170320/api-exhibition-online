import { BoothVideo as BoothVideoDto } from '@/components/exhibition/dto/booth-video.dto';
import { BoothVideo } from '@/components/exhibition/entities/booth-video.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothVideoConverter {
    toDto(entity: BoothVideo) {
        const dto = {
            id: entity.id,
            video_id: entity.video?.videoId ?? undefined,
            booth_template_position: entity.boothTemplatePosition ?? undefined,
        } as BoothVideoDto;

        return dto;
    }
}
