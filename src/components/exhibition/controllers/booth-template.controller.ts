import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BoothTemplateService } from '@/components/exhibition/services/booth-template.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { BoothTemplate as BoothTemplateDto } from '@/components/exhibition/dto/booth-template.dto';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';

@Controller('booth-templates')
export class BoothTemplateController {
    constructor(private readonly boothTemplateService: BoothTemplateService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
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

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    getBoothTemplates(@Paginate() query: PaginateQuery) {
        return this.boothTemplateService.findBoothTemplates(query);
    }

    @Post()
    createBoothTemplate(@Body() boothTemplateDto: BoothTemplateDto) {
        return this.boothTemplateService.createBoothTemplate(boothTemplateDto);
    }
}
