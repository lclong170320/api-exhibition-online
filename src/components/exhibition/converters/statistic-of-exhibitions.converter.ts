import { StatisticOfExhibitions } from '@/components/exhibition/dto/statistic-of-exhibitions.dto';
import { Injectable } from '@nestjs/common';
import { Status } from '@/components/exhibition/entities/exhibition.entity';

@Injectable()
export class StatisticOfExhibitionsConverter {
    toDto(
        id: number,
        exhibition_name: string,
        category_id: number,
        view: number,
        total_enterprise: number,
        total_booth: number,
        status: Status,
    ) {
        const dto = {
            id,
            exhibition_name,
            category_id,
            view,
            total_enterprise,
            total_booth,
            status,
        } as StatisticOfExhibitions;
        return dto;
    }
}
