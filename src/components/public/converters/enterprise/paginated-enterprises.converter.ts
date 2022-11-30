import { Injectable } from '@nestjs/common';
import { Enterprise } from '@/components/enterprise/entities/enterprise.entity';
import { PaginatedEnterprises as PaginatedEnterprisesDto } from '@/components/enterprise/dto/paginated-enterprises.dto';

import { EnterpriseConverter } from './enterprise.converter';

@Injectable()
export class PaginatedEnterprisesConverter {
    constructor(private enterpriseConverter: EnterpriseConverter) {}
    toDto(page: number, limit: number, total: number, entity: Enterprise[]) {
        const dto = {
            limit: limit,
            page: page,
            total: total,
            enterprises: entity.map((data) =>
                this.enterpriseConverter.toDto(data),
            ),
        } as PaginatedEnterprisesDto;

        return dto;
    }
}
