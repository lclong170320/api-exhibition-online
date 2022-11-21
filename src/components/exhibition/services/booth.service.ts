import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DbConnection } from '@/database/config/db';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import {
    Location,
    Status,
} from '@/components/exhibition/entities/location.entity';
import { JwtService } from '@nestjs/jwt';
import { BoothListConverter } from '../converters/booth-list.converter';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { UtilService } from '@/utils/helper/util.service';
import { paginate } from '@/utils/pagination';

@Injectable()
export class BoothService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly boothListConverter: BoothListConverter,
        private readonly jwtService: JwtService,
        private readonly utilService: UtilService,
    ) {}

    async findBooths(jwtAccessToken: string, query: PaginateQuery) {
        const filterableColumns = ['enterpriseId'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = [
            'boothImages.boothTemplatePosition',
            'boothProjects.boothTemplatePosition',
            'boothProducts.boothTemplatePosition',
            'boothProducts.boothTemplatePosition',
            'boothVideos.boothTemplatePosition',
            'boothTemplate',
            'location',
        ];

        const decodedJwtAccessToken = this.jwtService.decode(jwtAccessToken);

        const enterpriseId = await this.utilService.getEnterpriseIdFromToken(
            jwtAccessToken,
            decodedJwtAccessToken['user'].id,
        );

        const firstEnterprise = await this.utilService.checkEnterprise(
            enterpriseId,
        );

        query.filter = { enterpriseId: enterpriseId.toString() };

        if (!firstEnterprise) {
            throw new UnauthorizedException('Do not have access');
        }

        const boothRepository = this.dataSource.getRepository(Booth);

        const [booths, total] = await paginate(query, boothRepository, {
            filterableColumns,
            populatableColumns,
            defaultSortBy,
        });

        return this.boothListConverter.toDto(
            query.page,
            query.limit,
            total,
            booths,
        );
    }

    async deleteBooth(id: string) {
        await this.dataSource.transaction(async (manager) => {
            const boothRepository = manager.getRepository(Booth);
            const locationRepository = this.dataSource.getRepository(Location);

            const firstBooth = await boothRepository.findOne({
                where: {
                    id: parseInt(id),
                },
                relations: ['location'],
            });

            if (!firstBooth) {
                throw new NotFoundException(`The 'booth_id' not found`);
            }

            const location = await locationRepository.findOneBy({
                id: firstBooth.location.id,
            });

            location.status = Status.AVAILABLE;

            await locationRepository.save(location);

            await boothRepository.softRemove(firstBooth);
        });
    }
}
