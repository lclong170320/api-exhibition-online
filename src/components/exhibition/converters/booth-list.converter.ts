import { BoothList as BoothListDto } from '@/components/exhibition/dto/booth-list.dto';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import { Injectable } from '@nestjs/common';
import { BoothConverter } from './booth.converter';

@Injectable()
export class BoothListConverter {
    constructor(private boothConverter: BoothConverter) {}
    toDto(total: number, entity: Booth[]) {
        const dto = {
            total: total,
            booth: entity.map((data) => this.boothConverter.toDto(data)),
        } as BoothListDto;

        return dto;
    }
}
