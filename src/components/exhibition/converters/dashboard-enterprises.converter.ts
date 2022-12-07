import { DashboardEnterprises as DashboardEnterprisesDto } from '@/components/exhibition/dto/dashboard-enterprises.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardEnterprisesConverter {
    toDto(enterprise_name: string, quantity: number) {
        const dto = {
            enterprise_name: enterprise_name,
            quantity: quantity,
        } as DashboardEnterprisesDto;

        return dto;
    }
}
