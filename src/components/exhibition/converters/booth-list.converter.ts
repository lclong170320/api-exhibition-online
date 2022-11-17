import { BoothList as BoothListDto } from '@/components/exhibition/dto/booth-list.dto';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import { Injectable } from '@nestjs/common';
import { BoothConverter } from './booth.converter';

@Injectable()
export class BoothListConverter {
    constructor(private boothConverter: BoothConverter) {}
    toDto(page: number, limit: number, total: number, booth: Booth[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            booths: booth.map((data) => this.boothConverter.toDto(data)),
        } as BoothListDto;

        return dto;
    }
}
