import { StatisticOfExhibitions } from './../dto/statistic-of-exhibitions.dto';
import { Dashboard as DashboardDto } from '@/components/exhibition/dto/dashboard.dto';
import { Injectable } from '@nestjs/common';
import { DashboardBoothTemplates } from '../dto/dashboard-booth-templates.dto';
import { DashboardEnterprises } from '../dto/dashboard-enterprises.dto';
import { DashboardExhibitions } from '../dto/dashboard-exhibitions.dto';
import { DashboardViewerOfExhibitions } from '../dto/dashboard-viewer-of-exhibitions.dto';
import { DashboardBoothTemplatesConverter } from './dashboard-booth-templates.converter';
import { DashboardEnterprisesConverter } from './dashboard-enterprises.converter';
import { DashboardExhibitionsConverter } from './dashboard-exhibitions.converter';
import { DashboardViewerOfExhibitionsConverter } from './dashboard-viewer-of-exhibitions.converter';
import { StatisticOfExhibitionsConverter } from './statistic-of-exhibitions.converter';

@Injectable()
export class DashboardConverter {
    constructor(
        private dashboardBoothTemplatesConverter: DashboardBoothTemplatesConverter,
        private dashboardExhibitionsConverter: DashboardExhibitionsConverter,
        private dashboardEnterprisesConverter: DashboardEnterprisesConverter,
        private dashboardViewerOfExhibitionsConverter: DashboardViewerOfExhibitionsConverter,
        private statisticOfExhibitionsConverter: StatisticOfExhibitionsConverter,
    ) {}
    toDto(
        max_view_exhibition: number,
        total_viewer: number,
        viewer_of_exhibitions: DashboardViewerOfExhibitions[],
        enterprises: DashboardEnterprises[],
        booth_templates: DashboardBoothTemplates[],
        exhibitions: DashboardExhibitions,
        statistic_of_exhibitions: StatisticOfExhibitions[],
        total_livestream: number,
        total_meeting: number,
    ) {
        const dto = {
            max_view_exhibition: max_view_exhibition,
            total_viewer: total_viewer,
            viewer_of_exhibitions: viewer_of_exhibitions.map((data) =>
                this.dashboardViewerOfExhibitionsConverter.toDto(
                    data.exhibition_name,
                    data.view,
                ),
            ),
            enterprises: enterprises.map((data) =>
                this.dashboardEnterprisesConverter.toDto(
                    data.enterprise_name,
                    data.quantity,
                    data.quantity_booth,
                ),
            ),
            booth_templates: booth_templates.map((data) =>
                this.dashboardBoothTemplatesConverter.toDto(
                    data.booth_template_name,
                    data.quantity,
                ),
            ),
            exhibitions: this.dashboardExhibitionsConverter.toDto(
                exhibitions._new,
                exhibitions.listing,
                exhibitions.finished,
                exhibitions.project,
                exhibitions.product,
            ),
            statistic_of_exhibitions: statistic_of_exhibitions.map((data) =>
                this.statisticOfExhibitionsConverter.toDto(
                    data.id,
                    data.exhibition_name,
                    data.category_id,
                    data.view,
                    data.total_enterprise,
                    data.total_booth,
                    data.status,
                ),
            ),
            total_livestream,
            total_meeting,
        } as DashboardDto;

        return dto;
    }
}
