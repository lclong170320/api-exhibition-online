import { Controller, Get, Param } from '@nestjs/common';
import { SpaceTemplateService } from '@/components/exhibition/services/space-template.service';
import { PaginateQuery, Paginate } from '@/decorators/paginate.decorator';

@Controller('space-templates')
export class SpaceTemplateController {
    constructor(private readonly spaceTemplateService: SpaceTemplateService) {}

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
}
