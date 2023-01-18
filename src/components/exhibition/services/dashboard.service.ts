import { StatisticOfExhibitions } from '@/components/exhibition/dto/statistic-of-exhibitions.dto';
import { DbConnection } from '@/database/config/db';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { EnterpriseClientService } from 'clients/enterprise.client';
import { UserClientService } from 'clients/user.client';
import { DataSource } from 'typeorm';
import { DashboardConverter } from '../converters/dashboard.converter';
import { DashboardBoothTemplates } from '../dto/dashboard-booth-templates.dto';
import { DashboardEnterprises } from '../dto/dashboard-enterprises.dto';
import { DashboardExhibitions } from '../dto/dashboard-exhibitions.dto';
import { BoothProduct } from '../entities/booth-product.entity';
import { BoothProject } from '../entities/booth-project.entity';
import { BoothTemplate } from '../entities/booth-template.entity';
import { Booth } from '../entities/booth.entity';
import { Exhibition } from '../entities/exhibition.entity';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';

@Injectable()
export class DashboardService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly userClientService: UserClientService,
        private readonly enterpriseClientService: EnterpriseClientService,
        private readonly dashboardConverter: DashboardConverter,
    ) {}

    async readDashboard(jwtAccessToken: string, query: PaginateQuery) {
        const populatableColumns = [
            'category',
            'booths',
            'booths.boothTemplate',
            'booths.liveStreams',
            'booths.meetings',
            'booths.boothProjects',
            'booths.boothProducts',
        ];

        query.populate = [
            'category',
            'booths',
            'booths.boothTemplate',
            'booths.liveStreams',
            'booths.meetings',
            'booths.boothProjects',
            'booths.boothProducts',
        ];

        const filterableColumns = ['category.id', 'status'];
        const searchableColumns = ['name'];

        const exhibitionRepository =
            this.dataSource.manager.getRepository(Exhibition);
        const boothProjectRepository =
            this.dataSource.manager.getRepository(BoothProject);
        const boothProductRepository =
            this.dataSource.manager.getRepository(BoothProduct);
        const boothTemplateRepository =
            this.dataSource.manager.getRepository(BoothTemplate);
        const boothRepository = this.dataSource.manager.getRepository(Booth);
        const [listExhibitions] = await paginate(query, exhibitionRepository, {
            searchableColumns,
            filterableColumns,
            populatableColumns,
            withDeleted: query.withDeleted,
        });

        const findExhibitions = await exhibitionRepository.find({
            relations: populatableColumns,
        });

        const dashboardExhibitions: DashboardExhibitions = {
            _new: 0,
            listing: 0,
            finished: 0,
            project: 0,
            product: 0,
        };

        const dashboardEnterprises: DashboardEnterprises[] = [];
        const dashboardBoothTemplates: DashboardBoothTemplates[] = [];
        const totalViewer = 5000;
        const maxViewExhibition = 5000;
        let totalLiveStream = 0;
        let totalMeeting = 0;
        const viewerOfExhibitions = [
            {
                exhibition_name: 'trien lam 1',
                view: 1000,
            },
            {
                exhibition_name: 'trien lam 2',
                view: 2000,
            },
        ];
        const statisticOfExhibitions: StatisticOfExhibitions[] = [];

        const findEnterprises =
            await this.enterpriseClientService.getEnterprises(jwtAccessToken);

        await Promise.all(
            findEnterprises.enterprises.map(async (enterprise) => {
                const checkUser =
                    await this.userClientService.getUserByEnterpriseId(
                        jwtAccessToken,
                        enterprise.id,
                    );
                dashboardEnterprises.push({
                    enterprise_name: enterprise.name,
                    quantity: checkUser.users.length,
                    quantity_booth: await boothRepository.count({
                        where: {
                            enterpriseId: enterprise.id,
                        },
                    }),
                });
            }),
        );

        const findBoothTemplates = await boothTemplateRepository.find();

        await Promise.all(
            findBoothTemplates.map(async (boothTemplate) => {
                dashboardBoothTemplates.push({
                    booth_template_name: boothTemplate.name,
                    quantity: await boothRepository.count({
                        where: {
                            boothTemplate: {
                                id: boothTemplate.id,
                            },
                        },
                    }),
                });
            }),
        );

        await Promise.all(
            findExhibitions.map(async (data) => {
                if (data.status === 'new') {
                    dashboardExhibitions._new++;
                }
                if (data.status === 'listing') {
                    dashboardExhibitions.listing++;
                }
                if (data.status === 'finished') {
                    dashboardExhibitions.finished++;
                }

                if (data.booths) {
                    await Promise.all(
                        data.booths.map(async (booth) => {
                            const checkProject =
                                await boothProjectRepository.count({
                                    where: {
                                        booth: {
                                            id: booth.id,
                                        },
                                    },
                                });
                            if (checkProject) {
                                dashboardExhibitions.project += checkProject;
                            }

                            const checkProduct =
                                await boothProductRepository.count({
                                    where: {
                                        booth: {
                                            id: booth.id,
                                        },
                                    },
                                });
                            if (checkProduct) {
                                dashboardExhibitions.product += checkProduct;
                            }
                        }),
                    );
                }
            }),
        );

        await Promise.all(
            listExhibitions.map(async (data) => {
                const unique = [
                    ...new Set(data.booths.map((booth) => booth.enterpriseId)),
                ];
                statisticOfExhibitions.push({
                    id: data.id,
                    exhibition_name: data.name,
                    category_id: data.category.id,
                    view: 1000,
                    total_enterprise: unique.length,
                    total_booth: data.booths.length,
                    status: data.status,
                });
                data.booths.map((data) => {
                    totalLiveStream += data.liveStreams.length;
                    totalMeeting += data.meetings.length;
                });
            }),
        );
        return this.dashboardConverter.toDto(
            maxViewExhibition,
            totalViewer,
            viewerOfExhibitions,
            dashboardEnterprises,
            dashboardBoothTemplates,
            dashboardExhibitions,
            statisticOfExhibitions,
            totalLiveStream,
            totalMeeting,
        );
    }
}
