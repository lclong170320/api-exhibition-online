import { PaginatedBooths as PaginatedBoothsDto } from '@/components/exhibition/dto/paginated-booths.dto';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import { Injectable } from '@nestjs/common';
import { BoothConverter } from './booth.converter';

@Injectable()
export class PaginatedBoothsConverter {
    constructor(private boothConverter: BoothConverter) {}
    toDto(page: number, limit: number, total: number, booth: Booth[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            booths: booth.map((data) => this.boothConverter.toDto(data)),
        } as PaginatedBoothsDto;

        return dto;
    }
}
