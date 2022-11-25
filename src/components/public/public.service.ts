import { Enterprise } from '@/components/enterprise/entities/enterprise.entity';
import {
    Exhibition,
    Status as StatusExhibition,
} from '@/components/exhibition/entities/exhibition.entity';
import { Media } from '@/components/media/entities/media.entity';
import { EnterpriseConverter } from '@/components/public/converters/enterprise/enterprise.converter';
import { ExhibitionConverter } from '@/components/public/converters/exhibition/exhibition.converter';
import { MediaConverter } from '@/components/public/converters/media/media.converter';
import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Meeting as MeetingDto } from '../exhibition/dto/meeting.dto';
import { Booth } from '../exhibition/entities/booth.entity';
import { Conference } from '../exhibition/entities/conference.entity';
import { Meeting } from '../exhibition/entities/meeting.entity';
import { ConferenceConverter } from './converters/exhibition/conference.converter';
import { MeetingListConverter } from './converters/exhibition/meeting-list.converter';
import { MeetingConverter } from './converters/exhibition/meeting.converter';
import { BoothTemplate } from '../exhibition/entities/booth-template.entity';
import { BoothTemplateListConverter } from './converters/exhibition/booth-template-list.converter';
@Injectable()
export class PublicService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly exhibitionDataSource: DataSource,
        @InjectDataSource(DbConnection.mediaCon)
        private readonly mediaDataSource: DataSource,
        @InjectDataSource(DbConnection.enterpriseCon)
        private readonly enterpriseDataSource: DataSource,
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly conferenceDataSource: DataSource,
        private readonly conferenceConverter: ConferenceConverter,
        private readonly exhibitionConverter: ExhibitionConverter,
        private readonly mediaConverter: MediaConverter,
        private readonly enterpriseConverter: EnterpriseConverter,
        private readonly meetingConverter: MeetingConverter,
        private readonly meetingListConverter: MeetingListConverter,
        private readonly boothTemplateListConverter: BoothTemplateListConverter,
    ) {}

    async getExhibitionById(id: string, query: PaginateQuery) {
        const exhibitionRepository =
            this.exhibitionDataSource.manager.getRepository(Exhibition);
        const exhibitionEntity = await exhibitionRepository.findOne({
            where: {
                id: parseInt(id),
                status: StatusExhibition.LISTING,
            },
            relations: query.populate,
        });

        if (!exhibitionEntity) {
            throw new NotFoundException(`The 'id' not found: ${id}`);
        }
        return this.exhibitionConverter.toDto(exhibitionEntity);
    }

    async getMediaById(id: string) {
        const mediaId = parseInt(id);

        const mediaRepository =
            this.mediaDataSource.manager.getRepository(Media);

        const mediaEntity = await mediaRepository.findOne({
            where: {
                id: mediaId,
            },
        });

        if (!mediaEntity) {
            throw new NotFoundException(`The 'id' not found: ${mediaId}`);
        }

        return this.mediaConverter.toDto(mediaEntity);
    }

    async getEnterpriseById(id: string) {
        const enterpriseRepository =
            this.enterpriseDataSource.manager.getRepository(Enterprise);
        const enterprise = await enterpriseRepository.findOne({
            where: {
                id: parseInt(id),
            },
        });
        return this.enterpriseConverter.toDto(enterprise);
    }

    async createMeeting(meetingDto: MeetingDto) {
        const meetingRepository =
            this.exhibitionDataSource.manager.getRepository(Meeting);
        const boothRepository =
            this.exhibitionDataSource.manager.getRepository(Booth);

        const booth = await boothRepository.findOneBy({
            id: meetingDto.booth_id,
        });
        if (!booth) {
            throw new BadRequestException(
                `The booth not exist: ${meetingDto.booth_id}`,
            );
        }

        let meeting = this.meetingConverter.toEntity(meetingDto);
        meeting.booth = booth;

        meeting = await meetingRepository.save(meeting);

        return this.meetingConverter.toDto(meeting);
    }

    async getMeetings(query: PaginateQuery) {
        const sortableColumns = ['id', 'startTime', 'endTime', 'createdAt'];
        const searchableColumns = ['customerName', 'email', 'phone'];
        const filterableColumns = ['booth.id', 'id'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const meetingRepository =
            this.exhibitionDataSource.manager.getRepository(Meeting);
        const [meetings, total] = await paginate(query, meetingRepository, {
            searchableColumns,
            sortableColumns,
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

    async getConferenceById(id: string, populate: string[]) {
        const conferenceRepository =
            this.conferenceDataSource.manager.getRepository(Conference);
        const firstConference = await conferenceRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: populate,
        });

        if (!firstConference) {
            throw new NotFoundException(
                `The 'conference_id' ${id} is not found`,
            );
        }
        return this.conferenceConverter.toDto(firstConference);
    }
    async findBoothTemplates(query: PaginateQuery) {
        const sortableColumns = ['id', 'name', 'type', 'createdAt'];
        const searchableColumns = ['name'];
        const filterableColumns = ['type'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = query.populate;
        const boothTemplateRepository =
            this.exhibitionDataSource.manager.getRepository(BoothTemplate);
        const [boothTemplates, total] = await paginate(
            query,
            boothTemplateRepository,
            {
                searchableColumns,
                sortableColumns,
                populatableColumns,
                filterableColumns,
                defaultSortBy,
            },
        );

        return this.boothTemplateListConverter.toDto(
            query.page,
            query.limit,
            total,
            boothTemplates,
        );
    }
}
