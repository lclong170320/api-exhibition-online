import { Contact as ContactDto } from '@/components/exhibition/dto/contact.dto';
import { Contact } from '@/components/exhibition/entities/contact.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactConverter {
    toEntity(dto: ContactDto) {
        const entity = new Contact();
        entity.name = dto.name;
        entity.phone = dto.phone;
        entity.email = dto.email;
        entity.address = dto.address;
        entity.note = dto.note;
        return entity;
    }

    toDto(entity: Contact) {
        const dto = {
            id: entity.id,
            name: entity.name,
            phone: entity.phone,
            email: entity.email,
            address: entity.address,
            note: entity.note ?? undefined,
        } as ContactDto;

        return dto;
    }
}
