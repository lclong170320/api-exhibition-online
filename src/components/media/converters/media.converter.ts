import { Injectable } from '@nestjs/common';
import { Media } from '@/components/media/entities/media.entity';
import { Media as MediaDto } from '@/components/media/dto/media.dto';
import { MediaResponse as MediaResponseDto } from '../dto/media-response.dto';

@Injectable()
export class MediaConverter {
    toEntity(dto: MediaDto) {
        const entity = new Media();
        entity.url = dto.url;
        entity.mime = dto.mime;
        entity.userId = dto.user_id;
        return entity;
    }

    toDto(entity: Media) {
        const dto = {
            id: entity.id,
            url: entity.url,
            mime: entity.mime,
            user_id: entity.userId,
        } as MediaResponseDto;

        return dto;
    }
}
