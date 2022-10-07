import { User as UserDto } from '@/components/user/dto/user.dto';
import { User } from '@/components/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InformationConverter } from './information.converter';

@Injectable()
export class UserConverter {
    constructor(private informationConverter: InformationConverter) {}
    toEntity(dto: UserDto) {
        const entity = new User();
        entity.phone = dto.phone;
        entity.password = dto.password;
        entity.status = dto.status;
        return entity;
    }

    toDto(entity: User) {
        const dto = {
            id: entity.id,
            phone: entity.phone,
            password: entity.password,
            role_id: entity.role.id,
            status: entity.status,
            information: this.informationConverter.toDto(entity.information),
        } as UserDto;

        return dto;
    }
}
