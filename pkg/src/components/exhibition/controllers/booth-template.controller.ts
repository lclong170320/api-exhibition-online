import { Controller, Get, Query } from '@nestjs/common';
import { BoothTemplateService } from '@/components/exhibition/services/booth-template.service';

@Controller('booth-templates')
export class BoothTemplateController {
    constructor(private readonly boothTemplateService: BoothTemplateService) {}

    @Get()
    getBoothTemplates(
        @Query('offset') offset: string,
        @Query('limit') limit: string,
    ) {
        return this.boothTemplateService.findBoothTemplates(offset, limit);
    }
}
