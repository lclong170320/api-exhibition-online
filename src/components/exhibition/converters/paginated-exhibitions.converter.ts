import { PaginatedExhibitions as PaginatedExhibitionsDto } from '@/components/exhibition/dto/paginated-exhibitions.dto';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';
import { Injectable } from '@nestjs/common';
import { ExhibitionConverter } from './exhibition.converter';

@Injectable()
export class PaginatedExhibitionsConverter {
    constructor(private exhibitionConverter: ExhibitionConverter) {}
    toDto(page: number, limit: number, total: number, entity: Exhibition[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            exhibitions: entity.map((data) =>
                this.exhibitionConverter.toDto(data),
            ),
        } as PaginatedExhibitionsDto;

        return dto;
    }
}
