import { Injectable } from '@nestjs/common';
import { PaginatedMedias as PaginatedMediasDto } from '../dto/paginated-medias.dto';
import { Media } from '../entities/media.entity';
import { MediaConverter } from './media.converter';

@Injectable()
export class PaginatedMediasConverter {
    constructor(private mediaConverter: MediaConverter) {}
    toDto(page: number, limit: number, total: number, entity: Media[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            medias: entity.map((data) => this.mediaConverter.toDto(data)),
        } as PaginatedMediasDto;

        return dto;
    }
}
