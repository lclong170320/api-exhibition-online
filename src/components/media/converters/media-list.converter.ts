import { Injectable } from '@nestjs/common';
import { MediaList } from '../dto/media-list.dto';
import { Media } from '../entities/media.entity';
import { MediaConverter } from './media.converter';

@Injectable()
export class MediaListConverter {
    constructor(private mediaConverter: MediaConverter) {}
    toDto(page: number, limit: number, total: number, entity: Media[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            medias: entity.map((data) => this.mediaConverter.toDto(data)),
        } as MediaList;

        return dto;
    }
}
