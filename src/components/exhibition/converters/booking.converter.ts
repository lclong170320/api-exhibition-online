import { Injectable } from '@nestjs/common';
import { Booking } from '@/components/exhibition/entities/booking.entity';
import { Booking as BookingDto } from '@/components/exhibition/dto/booking.dto';
@Injectable()
export class BookingConverter {
    toEntity(dto: BookingDto) {
        const entity = new Booking();
        entity.name = dto.name;
        entity.time = new Date(dto.time);
        entity.phone = dto.phone;
        entity.notes = dto.notes;
        return entity;
    }
    toDto(entity: Booking) {
        const dto = {
            id: entity.id,
            name: entity.name,
            notes: entity.notes,
            phone: entity.phone,
        } as BookingDto;
        return dto;
    }
}
