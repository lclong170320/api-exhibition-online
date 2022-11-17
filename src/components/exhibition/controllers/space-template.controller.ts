import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { SpaceTemplateService } from '@/components/exhibition/services/space-template.service';
import { PaginateQuery, Paginate } from '@/decorators/paginate.decorator';
import { SpaceTemplate as SpaceTemplateDto } from '@/components/exhibition/dto/space-template.dto';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';

@Controller('space-templates')
export class SpaceTemplateController {
    constructor(private readonly spaceTemplateService: SpaceTemplateService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    getSpaceTemplates(@Paginate() query: PaginateQuery) {
        return this.spaceTemplateService.getSpaceTemplates(query);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
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

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    createSpaceTemplate(@Body() spaceTemplateDto: SpaceTemplateDto) {
        return this.spaceTemplateService.createSpaceTemplate(spaceTemplateDto);
    }
}
