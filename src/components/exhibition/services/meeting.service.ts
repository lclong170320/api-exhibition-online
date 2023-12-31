import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PaginatedMeetingsConverter } from '../converters/paginated-meetings.converter';
import { Booth } from '../entities/booth.entity';
import { Meeting } from '../entities/meeting.entity';

@Injectable()
export class MeetingService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly paginatedMeetingsConverter: PaginatedMeetingsConverter,
    ) {}

    async readMeetings(enterpriseId: number, query: PaginateQuery) {
        const meetingRepository =
            this.dataSource.manager.getRepository(Meeting);
        const boothRepository = this.dataSource.manager.getRepository(Booth);
        const columnFilter = query.filter && Object.keys(query.filter);
        if (columnFilter && columnFilter.includes('booth.id')) {
            const valueFilter = query.filter['booth.id'].toString();

            let boothId = valueFilter;

            if (valueFilter.includes(':')) boothId = valueFilter.split(':')[1];

            const firstBooth = await boothRepository.findOneBy({
                id: parseInt(boothId),
            });

            if (!firstBooth) {
                throw new BadRequestException('The booth_id not found');
            }

            if (enterpriseId === firstBooth.enterpriseId) {
                const sortableColumns = [
                    'id',
                    'startTime',
                    'endTime',
                    'createdAt',
                ];
                const searchableColumns = ['customerName', 'email', 'phone'];
                const filterableColumns = ['booth.id', 'id'];
                const defaultSortBy = [['createdAt', 'DESC']];

                const populatableColumns = query.populate;
                const [meetings, total] = await paginate(
                    query,
                    meetingRepository,
                    {
                        searchableColumns,
                        sortableColumns,
                        populatableColumns,
                        filterableColumns,
                        defaultSortBy,
                        withDeleted: query.withDeleted,
                    },
                );
                return this.paginatedMeetingsConverter.toDto(
                    query.page,
                    query.limit,
                    total,
                    meetings,
                );
            }

            return this.paginatedMeetingsConverter.toDto(
                query.page,
                query.limit,
                0,
                [],
            );
        }

        const sortableColumns = ['id', 'startTime', 'endTime', 'createdAt'];
        const searchableColumns = ['customerName', 'email', 'phone'];
        const filterableColumns = ['booth.id', 'id'];
        const defaultSortBy = [['createdAt', 'DESC']];

        const populatableColumns = query.populate;
        const [meetings, total] = await paginate(query, meetingRepository, {
            searchableColumns,
            sortableColumns,
            populatableColumns,
            filterableColumns,
            defaultSortBy,
        });
        return this.paginatedMeetingsConverter.toDto(
            query.page,
            query.limit,
            total,
            meetings,
        );
    }
}
