import { User as UserDto } from '@/components/user/dto/user.dto';
import { Status, User } from '@/components/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { RoleConverter } from './role.converter';

@Injectable()
export class UserConverter {
    constructor(private readonly roleConverter: RoleConverter) {}
    toEntity(dto: UserDto) {
        const entity = new User();
        entity.phone = dto.phone;
        entity.email = dto.email;
        entity.password = dto.password;
        entity.status =
            dto.status === UserDto.StatusEnum.Active
                ? Status.ACTIVE
                : Status.INACTIVE;
        return entity;
    }

    toDto(entity: User) {
        const dto = {
            id: entity.id,
            phone: entity.phone,
            email: entity.email,
            role: entity.role
                ? this.roleConverter.toDto(entity.role)
                : undefined,
            status: entity.status,
        } as UserDto;

        return dto;
    }
}
