import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { BoothOrganizationTemplateService } from '@/components/exhibition/services/booth-organization-template.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { BoothOrganizationTemplate as BoothOrganizationTemplateDto } from '@/components/exhibition/dto/booth-organization-template.dto';
import { CurrentUser } from '@/decorators/current-user';
import { User } from '@/components/exhibition/dto/user.dto';

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

    @Post()
    createBoothOrganizationTemplate(
        @CurrentUser() user: User,
        @Body() boothOrganizationTemplateDto: BoothOrganizationTemplateDto,
    ) {
        return this.boothOrganizationTemplateService.createBoothOrganizationTemplate(
            user,
            boothOrganizationTemplateDto,
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
