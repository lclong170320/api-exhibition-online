import { PaginatedRegistrations as PaginatedRegistrationsDto } from '@/components/exhibition/dto/paginated-registrations.dto';
import { Registration } from '@/components/exhibition/entities/registration.entity';
import { Injectable } from '@nestjs/common';
import { RegistrationConverter } from './registration.converter';

@Injectable()
export class PaginatedRegistrationsConverter {
    constructor(
        private readonly registrationConverter: RegistrationConverter,
    ) {}

    toDto(
        page: number,
        limit: number,
        total: number,
        registration: Registration[],
    ) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            registrations: registration.map((data) =>
                this.registrationConverter.toDto(data),
            ),
        } as PaginatedRegistrationsDto;

        return dto;
    }
}
