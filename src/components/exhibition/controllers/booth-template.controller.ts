import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BoothTemplateService } from '@/components/exhibition/services/booth-template.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { BoothTemplate as BoothTemplateDto } from '@/components/exhibition/dto/booth-template.dto';

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

    @Post()
    createBoothTemplate(@Body() boothTemplateDto: BoothTemplateDto) {
        return this.boothTemplateService.createBoothTemplate(boothTemplateDto);
    }
}
