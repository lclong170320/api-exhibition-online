import { BoothListConverter } from '@/components/exhibition/converters/booth-list.converter';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import {
    Location,
    Status,
} from '@/components/exhibition/entities/location.entity';
import { LoginPayload } from '@/components/user/dto/login-payload.dto';
import { RoleName } from '@/components/user/dto/role.dto';
import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { UtilService } from '@/utils/helper/util.service';
import { paginate } from '@/utils/pagination';
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { keys } from 'lodash';

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
        const filterableColumns = keys(query.filter);
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = query.populate;

        const decodedJwtAccessToken = this.jwtService.decode(
            jwtAccessToken,
        ) as LoginPayload;

        const enterpriseId = await this.utilService.getEnterpriseIdFromToken(
            jwtAccessToken,
            decodedJwtAccessToken['user'].id,
        );

        const firstEnterprise = await this.utilService.checkEnterprise(
            enterpriseId,
        );

        if (!firstEnterprise) {
            throw new UnauthorizedException('Do not have access');
        }

        const roleName = decodedJwtAccessToken.user.role.name;
        if (roleName === RoleName.USER) {
            filterableColumns.push('enterpriseId');
            query.filter = {
                enterpriseId: enterpriseId.toString(),
                ...query.filter,
            };
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
