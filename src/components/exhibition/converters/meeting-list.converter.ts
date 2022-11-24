import { MeetingList as MeetingListDto } from '@/components/exhibition/dto/meeting-list.dto';
import { Meeting } from '@/components/exhibition/entities/meeting.entity';
import { Injectable } from '@nestjs/common';
import { MeetingConverter } from './meeting.converter';

@Injectable()
export class MeetingListConverter {
    constructor(private meetingConverter: MeetingConverter) {}
    toDto(page: number, limit: number, total: number, booth: Meeting[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            meetings: booth.map((data) => this.meetingConverter.toDto(data)),
        } as MeetingListDto;

        return dto;
    }
}
