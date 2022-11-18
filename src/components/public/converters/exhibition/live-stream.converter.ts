import { LiveStream as LiveStreamDto } from '@/components/exhibition/dto/live-stream.dto';
import { LiveStream } from '@/components/exhibition/entities/live-stream.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LiveStreamConverter {
    toEntity(dto: LiveStreamDto) {
        const entity = new LiveStream();
        entity.time = new Date(dto.time);
        entity.link = dto.link;
        return entity;
    }

    toDto(entity: LiveStream) {
        const dto = {
            id: entity.id,
            link: entity.link,
            time: entity.time.toISOString(),
        } as LiveStreamDto;

        return dto;
    }
}
