import { Controller, Get, Param, Delete, HttpCode } from '@nestjs/common';
import { BoothOrganizationTemplateService } from '@/components/exhibition/services/booth-organization-template.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';

@Controller('booth-organization-templates')
export class BoothOrganizationTemplateController {
    constructor(
        private readonly boothOrganizationTemplateService: BoothOrganizationTemplateService,
    ) {}

    @Get()
    getBoothOrganizationTemplates(@Paginate() query: PaginateQuery) {
        return this.boothOrganizationTemplateService.findBoothOrganizationTemplates(
            query,
        );
    }

    @Get(':id')
    getBoothOrganizationTemplateById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothOrganizationTemplateService.findBoothOrganizationTemplateById(
            id,
            query.populate,
        );
    }

    @Delete(':id')
    @HttpCode(204)
    deleteBoothTemplate(@Param('id') id: string) {
        return this.boothOrganizationTemplateService.deleteBoothOrganizationTemplate(
            id,
        );
    }
}
