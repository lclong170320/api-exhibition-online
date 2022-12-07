import { DashboardExhibitions as DashboardExhibitionsDto } from '@/components/exhibition/dto/dashboard-exhibitions.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardExhibitionsConverter {
    toDto(
        _new: number,
        listing: number,
        finished: number,
        project: number,
        product: number,
    ) {
        const dto = {
            _new: _new,
            listing: listing,
            finished: finished,
            project: project,
            product: product,
        } as DashboardExhibitionsDto;

        return dto;
    }
}
