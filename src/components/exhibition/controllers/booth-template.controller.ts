import { Controller, Get, Param } from '@nestjs/common';
import { BoothTemplateService } from '@/components/exhibition/services/booth-template.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';

@Controller('booth-templates')
export class BoothTemplateController {
    constructor(private readonly boothTemplateService: BoothTemplateService) {}

    @Get(':id')
    getBoothTemplateById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothTemplateService.findBoothTemplateById(
            id,
            query.populate,
        );
    }

    @Get()
    getBoothTemplates(@Paginate() query: PaginateQuery) {
        return this.boothTemplateService.findBoothTemplates(query);
    }

    @Get('organization/:id')
    getBoothOrganizationTemplateById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothTemplateService.findBoothOrganizationTemplateById(
            id,
            query.populate,
        );
    }
}
