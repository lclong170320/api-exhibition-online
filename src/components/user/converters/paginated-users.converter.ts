import { PaginatedUsers as PaginatedUsersDto } from '@/components/user/dto/paginated-users.dto';
import { User } from '@/components/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { UserConverter } from './user.converter';

@Injectable()
export class PaginatedUsersConverter {
    constructor(private userConverter: UserConverter) {}
    toDto(page: number, limit: number, total: number, user: User[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            users: user.map((data) => this.userConverter.toDto(data)),
        } as PaginatedUsersDto;

        return dto;
    }
}
