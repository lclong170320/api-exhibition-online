import { StatisticOfExhibitions } from '@/components/exhibition/dto/statistic-of-exhibitions.dto';
import { Injectable } from '@nestjs/common';
import { Status } from '@/components/exhibition/entities/exhibition.entity';

@Injectable()
export class StatisticOfExhibitionsConverter {
    toDto(
        exhibition_name: string,
        type: string,
        view: number,
        total_enterprise: number,
        total_booth: number,
        status: Status,
    ) {
        const dto = {
            exhibition_name,
            type,
            view,
            total_enterprise,
            total_booth,
            status,
        } as StatisticOfExhibitions;
        return dto;
    }
}
