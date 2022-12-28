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
import { Meeting as MeetingDto } from '@/components/exhibition/dto/meeting.dto';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import { Conference } from '@/components/exhibition/entities/conference.entity';
import { Meeting } from '@/components/exhibition/entities/meeting.entity';
import { ConferenceConverter } from './converters/exhibition/conference.converter';
import { PaginatedMeetingsConverter } from './converters/exhibition/paginated-meetings.converter';
import { MeetingConverter } from './converters/exhibition/meeting.converter';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { PaginatedBoothTemplatesConverter } from './converters/exhibition/paginated-booth-templates.converter';
import { CountProject } from '@/components/exhibition/entities/count-project.entity';
import { BoothProject } from '@/components/exhibition/entities/booth-project.entity';
import { LikeProject } from '@/components/exhibition/entities/like-project.entity';
import { PaginatedExhibitionsConverter } from './converters/exhibition/paginated-exhibitions.converter';
import { Contact as ContactDto } from '@/components/exhibition/dto/contact.dto';
import { Contact } from '@/components/exhibition/entities/contact.entity';
import { ContactConverter } from './converters/exhibition/contact.converter';

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
        private readonly paginatedMeetingsConverter: PaginatedMeetingsConverter,
        private readonly paginatedBoothTemplatesConverter: PaginatedBoothTemplatesConverter,
        private readonly paginatedExhibitionsConverter: PaginatedExhibitionsConverter,
        private readonly contactConverter: ContactConverter,
    ) {}

    async readExhibitions(query: PaginateQuery) {
        const sortableColumns = ['id', 'name', 'createdAt'];
        const searchableColumns = ['name'];
        const filterableColumns = ['status', 'slug'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = query.populate;
        const exhibitionRepository =
            this.exhibitionDataSource.manager.getRepository(Exhibition);
        const [exhibitions, total] = await paginate(
            query,
            exhibitionRepository,
            {
                searchableColumns,
                sortableColumns,
                populatableColumns,
                filterableColumns,
                defaultSortBy,
                withDeleted: query.withDeleted,
            },
        );

        return this.paginatedExhibitionsConverter.toDto(
            query.page,
            query.limit,
            total,
            exhibitions,
        );
    }

    async readExhibitionById(id: string, query: PaginateQuery) {
        const exhibitionRepository =
            this.exhibitionDataSource.manager.getRepository(Exhibition);
        const exhibitionEntity = await exhibitionRepository.findOne({
            where: {
                id: parseInt(id),
                status: StatusExhibition.LISTING,
            },
            relations: query.populate,
            withDeleted: query.withDeleted,
        });

        if (!exhibitionEntity) {
            throw new NotFoundException(`The 'id' not found: ${id}`);
        }
        return this.exhibitionConverter.toDto(exhibitionEntity);
    }

    async readMediaById(id: string) {
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

    async readEnterpriseById(id: string) {
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

    async readMeetings(query: PaginateQuery) {
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
            withDeleted: query.withDeleted,
        });
        return this.paginatedMeetingsConverter.toDto(
            query.page,
            query.limit,
            total,
            meetings,
        );
    }

    async readConferenceById(id: string, query: PaginateQuery) {
        const conferenceRepository =
            this.conferenceDataSource.manager.getRepository(Conference);
        const firstConference = await conferenceRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: query.populate,
            withDeleted: query.withDeleted,
        });

        if (!firstConference) {
            throw new NotFoundException(
                `The 'conference_id' ${id} is not found`,
            );
        }
        return this.conferenceConverter.toDto(firstConference);
    }
    async readBoothTemplates(query: PaginateQuery) {
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
                withDeleted: query.withDeleted,
            },
        );

        return this.paginatedBoothTemplatesConverter.toDto(
            query.page,
            query.limit,
            total,
            boothTemplates,
        );
    }

    async createCountProject(id: string) {
        const countProjectRepository =
            this.exhibitionDataSource.manager.getRepository(CountProject);
        const countProjectEntity = new CountProject();
        countProjectEntity.boothProjectId = parseInt(id);

        await countProjectRepository.save(countProjectEntity);
    }

    async countViewProject() {
        const countProjectRepository =
            this.exhibitionDataSource.manager.getRepository(CountProject);
        const boothProjectRepository =
            this.exhibitionDataSource.manager.getRepository(BoothProject);

        const [boothProject] = await boothProjectRepository.findAndCount();

        const updatedBoothProject = await Promise.all(
            boothProject.map(async (data) => {
                const [project, count] =
                    await countProjectRepository.findAndCountBy({
                        boothProjectId: data.id,
                    });

                await countProjectRepository.remove(project);

                data.view += count;

                return data;
            }),
        );

        await boothProjectRepository.save(updatedBoothProject);
    }

    async createLikeProject(id: string) {
        const likeProjectRepository =
            this.exhibitionDataSource.manager.getRepository(LikeProject);
        const likeProjectEntity = new LikeProject();
        likeProjectEntity.boothProjectId = parseInt(id);

        await likeProjectRepository.save(likeProjectEntity);
    }

    async countLikeProject() {
        const likeProjectRepository =
            this.exhibitionDataSource.manager.getRepository(LikeProject);
        const boothProjectRepository =
            this.exhibitionDataSource.manager.getRepository(BoothProject);

        const boothProject = await boothProjectRepository.find();

        const updatedBoothProject = await Promise.all(
            boothProject.map(async (data) => {
                const [project, count] =
                    await likeProjectRepository.findAndCountBy({
                        boothProjectId: data.id,
                    });

                await likeProjectRepository.remove(project);

                data.like += count;

                return data;
            }),
        );

        await boothProjectRepository.save(updatedBoothProject);
    }

    async createContact(contactDto: ContactDto, id: string) {
        const contactRepository =
            this.exhibitionDataSource.manager.getRepository(Contact);
        const exhibitionRepository =
            this.exhibitionDataSource.manager.getRepository(Exhibition);
        const firstExhibition = await exhibitionRepository.findOneBy({
            id: Number(id),
        });

        if (!firstExhibition)
            throw new BadRequestException(
                `The exhibition_id: ${id} is not found`,
            );
        const newContactEntity = this.contactConverter.toEntity(contactDto);
        newContactEntity.exhibition = firstExhibition;
        const savedContact = await contactRepository.save(newContactEntity);
        return this.contactConverter.toDto(savedContact);
    }
}
