import { Controller, Get, Param, Query } from '@nestjs/common';
import { BoothTemplateService } from '@/components/exhibition/services/booth-template.service';

@Controller('booth-templates')
export class BoothTemplateController {
    constructor(private readonly boothTemplateService: BoothTemplateService) {}

    @Get(':id')
    getBoothTemplateById(@Param('id') id: string) {
        return this.boothTemplateService.findBoothTemplateById(id);
    }

    @Get()
    getBoothTemplates(
        @Query('offset') offset: string,
        @Query('limit') limit: string,
    ) {
        return this.boothTemplateService.findBoothTemplates(offset, limit);
    }
}
