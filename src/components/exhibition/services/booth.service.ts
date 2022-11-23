import { BookingConverter } from '@/components/exhibition/converters/booking.converter';
import { BoothListConverter } from '@/components/exhibition/converters/booth-list.converter';
import { Booking as BookingDto } from '@/components/exhibition/dto/booking.dto';
import { Booking } from '@/components/exhibition/entities/booking.entity';
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

        query.filter = {};
        if (roleName === RoleName.USER) {
            query.filter = {
                enterpriseId: enterpriseId.toString(),
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
