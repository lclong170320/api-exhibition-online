import { DashboardViewerOfExhibitions as DashboardViewerOfExhibitionsDto } from '@/components/exhibition/dto/dashboard-viewer-of-exhibitions.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardViewerOfExhibitionsConverter {
    toDto(exhibition_name: string, view: number) {
        const dto = {
            exhibition_name: exhibition_name,
            view: view,
        } as DashboardViewerOfExhibitionsDto;

        return dto;
    }
}
