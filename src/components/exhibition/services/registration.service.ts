import { PaginatedRegistrationsConverter } from '@/components/exhibition/converters/paginated-registrations';
import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { keys } from 'lodash';
import { DataSource } from 'typeorm';
import { Registration } from '../entities/registration.entity';

@Injectable()
export class RegistrationService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly paginatedRegistrationsConverter: PaginatedRegistrationsConverter,
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
}
