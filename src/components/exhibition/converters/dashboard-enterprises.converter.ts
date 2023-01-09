import { DashboardEnterprises as DashboardEnterprisesDto } from '@/components/exhibition/dto/dashboard-enterprises.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardEnterprisesConverter {
    toDto(enterprise_name: string, quantity: number, quantity_booth: number) {
        const dto = {
            enterprise_name: enterprise_name,
            quantity: quantity,
            quantity_booth: quantity_booth,
        } as DashboardEnterprisesDto;

        return dto;
    }
}
