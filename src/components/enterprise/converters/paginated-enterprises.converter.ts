import { Injectable } from '@nestjs/common';
import { PaginatedEnterprises as PaginatedEnterprisesDto } from '../dto/paginated-enterprises.dto';
import { Enterprise } from '../entities/enterprise.entity';
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
