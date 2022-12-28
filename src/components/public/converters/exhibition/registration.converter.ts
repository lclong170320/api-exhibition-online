import { Registration as RegistrationDto } from '@/components/exhibition/dto/registration.dto';
import { Registration } from '@/components/exhibition/entities/registration.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RegistrationConverter {
    toEntity(dto: RegistrationDto) {
        const entity = new Registration();
        entity.name = dto.name;
        entity.phone = dto.phone;
        entity.email = dto.email;
        entity.address = dto.address;
        entity.note = dto.note;
        return entity;
    }

    toDto(entity: Registration) {
        const dto = {
            id: entity.id,
            name: entity.name,
            phone: entity.phone,
            email: entity.email,
            address: entity.address,
            note: entity.note ?? undefined,
            exhibition_id: entity.exhibition.id,
        } as RegistrationDto;
        return dto;
    }
}
