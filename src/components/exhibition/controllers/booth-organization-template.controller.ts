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
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';

@Controller('booth-organization-templates')
export class BoothOrganizationTemplateController {
    constructor(
        private readonly boothOrganizationTemplateService: BoothOrganizationTemplateService,
    ) {}

    @Get()
    readBoothOrganizationTemplates(@Paginate() query: PaginateQuery) {
        return this.boothOrganizationTemplateService.readBoothOrganizationTemplates(
            query,
        );
    }

    @Get(':id')
    readBoothOrganizationTemplateById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothOrganizationTemplateService.readBoothOrganizationTemplateById(
            id,
            query,
        );
    }

    @Post()
    createBoothOrganizationTemplate(
        @JwtAccessToken() jwtAccessToken: string,
        @CurrentUser() user: User,
        @Body() boothOrganizationTemplateDto: BoothOrganizationTemplateDto,
    ) {
        return this.boothOrganizationTemplateService.createBoothOrganizationTemplate(
            jwtAccessToken,
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
