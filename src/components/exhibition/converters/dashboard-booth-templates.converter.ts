import { DashboardBoothTemplates as DashboardBoothTemplatesDto } from '@/components/exhibition/dto/dashboard-booth-templates.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardBoothTemplatesConverter {
    toDto(booth_templates: string, quantity: number) {
        const dto = {
            booth_template_name: booth_templates,
            quantity: quantity,
        } as DashboardBoothTemplatesDto;

        return dto;
    }
}
