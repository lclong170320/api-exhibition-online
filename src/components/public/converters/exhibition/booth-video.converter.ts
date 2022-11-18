import { BoothVideo as BoothVideoDto } from '@/components/exhibition/dto/booth-video.dto';
import { BoothVideo } from '@/components/exhibition/entities/booth-video.entity';
import { UtilService } from '@/utils/helper/util.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothVideoConverter {
    constructor(private readonly utilService: UtilService) {}
    async toDto(entity: BoothVideo) {
        const url = await this.utilService.getMediaUrl(entity['video'].videoId);
        const dto = {
            id: entity.id,
            video_id: entity['video'].videoId ?? undefined,
            video_url: url ?? undefined,
            booth_template_position: entity.boothTemplatePosition ?? undefined,
        } as BoothVideoDto;
        return dto;
    }
}
