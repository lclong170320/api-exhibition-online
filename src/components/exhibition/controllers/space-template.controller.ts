import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { SpaceTemplateService } from '@/components/exhibition/services/space-template.service';
import { PaginateQuery, Paginate } from '@/decorators/paginate.decorator';
import { SpaceTemplate as SpaceTemplateDto } from '@/components/exhibition/dto/space-template.dto';

@Controller('space-templates')
export class SpaceTemplateController {
    constructor(private readonly spaceTemplateService: SpaceTemplateService) {}

    @Get()
    getSpaceTemplates(@Paginate() query: PaginateQuery) {
        return this.spaceTemplateService.getSpaceTemplates(query);
    }

    @Get(':id')
    getSpaceTemplateById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.spaceTemplateService.findSpaceTemplateById(
            id,
            query.populate,
        );
    }

    @Post()
    createSpaceTemplate(@Body() spaceTemplateDto: SpaceTemplateDto) {
        return this.spaceTemplateService.createSpaceTemplate(spaceTemplateDto);
    }
}
