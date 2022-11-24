import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MeetingListConverter } from '../converters/meeting-list.converter';
import { Booth } from '../entities/booth.entity';
import { Meeting } from '../entities/meeting.entity';

@Injectable()
export class MeetingService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly meetingListConverter: MeetingListConverter,
    ) {}

    async getMeetings(enterpriseId: number, query: PaginateQuery) {
        const meetingRepository =
            this.dataSource.manager.getRepository(Meeting);
        const boothRepository = this.dataSource.manager.getRepository(Booth);
        let allowEnterprise = false;
        if (query.filter && query.filter['booth.id']) {
            const boothId = query.filter['booth.id'].includes(':')
                ? query.filter['booth.id'].toString().split(':')[1]
                : query.filter['booth.id'].toString();

            const firstBooth = await boothRepository.findOneBy({
                id: parseInt(boothId),
            });

            if (!firstBooth) {
                throw new BadRequestException('The booth_id not found');
            }

            if (enterpriseId === firstBooth.enterpriseId) {
                allowEnterprise = true;
            }
        }
        if (allowEnterprise) {
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
            return this.meetingListConverter.toDto(
                query.page,
                query.limit,
                total,
                meetings,
            );
        }

        return this.meetingListConverter.toDto(query.page, query.limit, 0, []);
    }
}
