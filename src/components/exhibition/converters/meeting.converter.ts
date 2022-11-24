import { Meeting as MeetingDto } from '@/components/exhibition/dto/meeting.dto';
import { Meeting } from '@/components/exhibition/entities/meeting.entity';
import { Injectable } from '@nestjs/common';
import { BoothConverter } from './booth.converter';

@Injectable()
export class MeetingConverter {
    constructor(private readonly boothConverter: BoothConverter) {}
    toEntity(dto: MeetingDto) {
        const entity = new Meeting();
        entity.customerName = dto.customer_name;
        entity.phone = dto.phone;
        entity.email = dto.email;
        entity.startTime = new Date(dto.start_time);
        entity.endTime = new Date(dto.end_time);
        entity.note = dto.note;
        return entity;
    }

    toDto(entity: Meeting) {
        const dto = {
            id: entity.id,
            customer_name: entity.customerName,
            phone: entity.phone,
            email: entity.email,
            start_time: entity.startTime.toISOString(),
            end_time: entity.endTime.toISOString(),
            note: entity.note,
            booth: entity.booth
                ? this.boothConverter.toDto(entity.booth)
                : undefined,
        } as MeetingDto;

        return dto;
    }
}
