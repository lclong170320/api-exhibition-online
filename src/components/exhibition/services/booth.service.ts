import { PaginatedBoothsConverter } from '@/components/exhibition/converters/paginated-booths.converter';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import {
    Location,
    Status,
} from '@/components/exhibition/entities/location.entity';
import { LoginPayload } from '@/components/user/dto/login-payload.dto';
import { RoleName } from '@/components/user/dto/role.dto';
import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
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
import { BoothConverter } from '@/components/exhibition/converters/booth.converter';
import { UserClientService } from 'clients/user.client';
import { EnterpriseClientService } from 'clients/enterprise.client';
import { LiveStream } from '@/components/exhibition/entities/live-stream.entity';
import { LiveStreamConverter } from '../converters/live-stream.converter';
import { LiveStream as LiveStreamDto } from '../dto/live-stream.dto';

@Injectable()
export class BoothService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly paginatedBoothsConverter: PaginatedBoothsConverter,
        private readonly liveStreamConverter: LiveStreamConverter,
        private readonly boothConverter: BoothConverter,
        private readonly jwtService: JwtService,
        private readonly userClientService: UserClientService,
        private readonly enterpriseClientService: EnterpriseClientService,
    ) {}

    async readBooths(jwtAccessToken: string, query: PaginateQuery) {
        const filterableColumns = keys(query.filter);
        const defaultSortBy = [['createdAt', 'DESC']];
        const searchableColumns = ['name'];
        const populatableColumns = query.populate;
        const decodedJwtAccessToken = this.jwtService.decode(
            jwtAccessToken,
        ) as LoginPayload;

        const enterpriseId =
            await this.userClientService.getEnterpriseIdFromToken(
                jwtAccessToken,
                decodedJwtAccessToken['user'].id,
            );

        const firstEnterprise =
            await this.enterpriseClientService.checkEnterprise(enterpriseId);

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
            searchableColumns,
            filterableColumns,
            populatableColumns,
            defaultSortBy,
            withDeleted: query.withDeleted,
        });

        return this.paginatedBoothsConverter.toDto(
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

    async readBoothById(id: string, query: PaginateQuery) {
        const boothRepository = this.dataSource.getRepository(Booth);

        const firstBooth = await boothRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: query.populate,
            withDeleted: query.withDeleted,
        });

        if (!firstBooth) {
            throw new NotFoundException(`The 'booth_id' ${id} is not found`);
        }

        return this.boothConverter.toDto(firstBooth);
    }

    async deleteLiveStream(id: string, livestreamId: string) {
        await this.dataSource.transaction(async (manager) => {
            const boothRepository = manager.getRepository(Booth);
            const liveStreamRepository = manager.getRepository(LiveStream);
            const firstBooth = await boothRepository.findOne({
                where: {
                    id: parseInt(id),
                    liveStreams: {
                        id: parseInt(livestreamId),
                    },
                },
                relations: ['liveStreams'],
            });
            if (!firstBooth) {
                throw new NotFoundException(
                    `The booth is not found: booth_id: ${id} and liveStream_id: ${livestreamId}`,
                );
            }
            await liveStreamRepository.softRemove(firstBooth.liveStreams[0]);
        });
    }

    async readLiveStreamByIdBooth(id: string, livestreamId: string) {
        const boothRepository = this.dataSource.getRepository(Booth);

        const firstBooth = await boothRepository.findOne({
            where: {
                id: parseInt(id),
                liveStreams: {
                    id: parseInt(livestreamId),
                },
            },
            relations: ['liveStreams'],
        });

        if (!firstBooth) {
            throw new NotFoundException(
                `The liveStream is not found: livestream_id: ${livestreamId} and booth_id: ${id}`,
            );
        }

        return this.liveStreamConverter.toDto(firstBooth.liveStreams[0]);
    }

    async updateLiveStream(
        id: string,
        livestreamId: string,
        liveStreamDto: LiveStreamDto,
    ) {
        const boothRepository = this.dataSource.manager.getRepository(Booth);
        const liveStreamRepository =
            this.dataSource.manager.getRepository(LiveStream);

        const firstBooth = await boothRepository.findOne({
            where: {
                id: parseInt(id),
                liveStreams: {
                    id: parseInt(livestreamId),
                },
            },
            relations: ['liveStreams'],
        });

        if (!firstBooth) {
            throw new NotFoundException(
                `The booth is not found: booth_id: ${id} and liveStream_id: ${livestreamId}`,
            );
        }

        const liveStreamEntity =
            this.liveStreamConverter.toEntity(liveStreamDto);

        const updateLiveStream = await liveStreamRepository.save({
            ...firstBooth.liveStreams[0],
            ...liveStreamEntity,
        });

        return this.liveStreamConverter.toDto(updateLiveStream);
    }
}
