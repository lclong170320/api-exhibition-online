import { PaginatedExhibitions as PaginatedExhibitionsDto } from '@/components/exhibition/dto/paginated-exhibitions.dto';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';
import { Injectable } from '@nestjs/common';
import { ExhibitionConverter } from './exhibition.converter';

@Injectable()
export class PaginatedExhibitionsConverter {
    constructor(private exhibitionConverter: ExhibitionConverter) {}
    async toDto(
        page: number,
        limit: number,
        total: number,
        entity: Exhibition[],
    ) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            exhibitions: await Promise.all(
                entity.map(
                    async (data) => await this.exhibitionConverter.toDto(data),
                ),
            ),
        } as PaginatedExhibitionsDto;

        return dto;
    }
}
