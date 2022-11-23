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
import { BoothListConverter } from '@/components/exhibition/converters/booth-list.converter';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { UtilService } from '@/utils/helper/util.service';
import { paginate } from '@/utils/pagination';
import { Booking } from '@/components/exhibition/entities/booking.entity';
import { BookingConverter } from '@/components/exhibition/converters/booking.converter';
import { Booking as BookingDto } from '@/components/exhibition/dto/booking.dto';

@Injectable()
export class BoothService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly boothListConverter: BoothListConverter,
        private readonly bookingConverter: BookingConverter,
        private readonly jwtService: JwtService,
        private readonly utilService: UtilService,
    ) {}

    async findBooths(jwtAccessToken: string, query: PaginateQuery) {
        const filterableColumns = ['enterpriseId'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = query.populate;

        const decodedJwtAccessToken = this.jwtService.decode(jwtAccessToken);

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

        if (
            query.filter &&
            query.filter.enterpriseId === enterpriseId.toString() &&
            decodedJwtAccessToken['user'].role['name'] === 'user'
        ) {
            query.filter = {
                enterpriseId: query.filter.enterpriseId,
            };
        }

        if (
            !query.filter &&
            decodedJwtAccessToken['user'].role['name'] === 'user'
        ) {
            query.filter = {
                enterpriseId: enterpriseId.toString(),
            };
        }

        if (
            decodedJwtAccessToken['user'].role['name'] === 'admin' &&
            !query.filter
        ) {
            query.filter = {};
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

    async createBooking(id: string, bookingDto: BookingDto) {
        const boothRepository = this.dataSource.getRepository(Booth);
        const bookingRepository = this.dataSource.getRepository(Booking);

        const firstBooth = await boothRepository.findOneBy({
            id: parseInt(id),
        });

        if (!firstBooth) {
            throw new NotFoundException(`The booth_id ${id} not found`);
        }

        const bookingEntity = this.bookingConverter.toEntity(bookingDto);

        bookingEntity.booth = firstBooth;

        const createdBooking = await bookingRepository.save(bookingEntity);

        return this.bookingConverter.toDto(createdBooking);
    }
}
