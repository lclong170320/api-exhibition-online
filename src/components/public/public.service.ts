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
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Meeting as MeetingDto } from '../exhibition/dto/meeting.dto';
import { Booth } from '../exhibition/entities/booth.entity';
import { Meeting } from '../exhibition/entities/meeting.entity';
import { MeetingConverter } from './converters/exhibition/meeting.converter';

@Injectable()
export class PublicService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly exhibitionDataSource: DataSource,
        @InjectDataSource(DbConnection.mediaCon)
        private readonly mediaDataSource: DataSource,
        @InjectDataSource(DbConnection.enterpriseCon)
        private readonly enterpriseDataSource: DataSource,
        private readonly exhibitionConverter: ExhibitionConverter,
        private readonly mediaConverter: MediaConverter,
        private readonly enterpriseConverter: EnterpriseConverter,
        private readonly meetingConverter: MeetingConverter,
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
}
