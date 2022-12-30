import { PaginatedRegistrationsConverter } from '@/components/exhibition/converters/paginated-registrations';
import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { keys } from 'lodash';
import { DataSource } from 'typeorm';
import { RegistrationConverter } from '@/components/exhibition/converters/registration.converter';
import { Registration } from '@/components/exhibition/entities/registration.entity';
import { Status } from '@/components/exhibition/dto/registration.dto';

@Injectable()
export class RegistrationService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly paginatedRegistrationsConverter: PaginatedRegistrationsConverter,
        private readonly registrationConverter: RegistrationConverter,
    ) {}

    async readRegistrations(query: PaginateQuery) {
        const filterableColumns = keys(query.filter);
        const defaultSortBy = [['createdAt', 'DESC']];
        const searchableColumns = ['name'];
        const populatableColumns = query.populate;
        const registrationRepository =
            this.dataSource.getRepository(Registration);
        const sortableColumns = ['id'];
        const [registrations, total] = await paginate(
            query,
            registrationRepository,
            {
                sortableColumns,
                searchableColumns,
                filterableColumns,
                populatableColumns,
                defaultSortBy,
                withDeleted: query.withDeleted,
            },
        );
        return this.paginatedRegistrationsConverter.toDto(
            query.page,
            query.limit,
            total,
            registrations,
        );
    }

    async readRegistrationById(id: string, query: PaginateQuery) {
        const registrationRepository =
            this.dataSource.manager.getRepository(Registration);
        const registrationFirst = await registrationRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: query.populate,
            withDeleted: query.withDeleted,
        });

        if (!registrationFirst) {
            throw new NotFoundException(
                `The 'registration_id' ${id} not found`,
            );
        }

        return this.registrationConverter.toDto(registrationFirst);
    }

    private readonly statusAllow = {
        NEW: ['accepted', 'refused'],
        ACCEPTED: [],
        REFUSED: [],
    };

    async updateRegistration(id: string, status: Status) {
        const registrationRepository =
            this.dataSource.manager.getRepository(Registration);
        const registration = await registrationRepository.findOneBy({
            id: parseInt(id),
        });
        if (!registration) {
            throw new BadRequestException(
                `The registration_id: ${id} is not found`,
            );
        }
        const registrationStatus = registration.status.toLocaleUpperCase();
        const isAllow =
            this.statusAllow[`${registrationStatus}`].includes(status);
        if (!isAllow) {
            throw new BadRequestException(
                `The status: ${status} is not allowed`,
            );
        }
        registration.status = status;
        const newRegistration = await registrationRepository.save({
            ...registration,
        });
        return this.registrationConverter.toDto(newRegistration);
    }
}
