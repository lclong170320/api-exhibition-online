import { ConferenceTemplate as ConferenceTemplateDto } from '@/components/exhibition/dto/conference-template.dto';
import { Role } from '@/components/exhibition/dto/role.dto';
import { User } from '@/components/user/dto/user.dto';
import { JWTAuthGuard } from 'guards/auth.guard';
import { CurrentUser } from '@/decorators/current-user';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Roles } from '@/decorators/roles.decorator';
import {
    Body,
    Controller,
    Post,
    UseGuards,
    Get,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common';
import { RolesGuard } from 'guards/roles.guard';
import { ConferenceTemplateService } from '@/components/exhibition/services/conference-template.service';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('conference-templates')
export class ConferenceTemplateController {
    constructor(
        private readonly conferenceTemplateService: ConferenceTemplateService,
    ) {}

    @Roles(Role.ADMIN)
    @Post()
    createConferenceTemplate(
        @JwtAccessToken() jwtAccessToken: string,
        @CurrentUser() user: User,
        @Body() conferenceTemplateDto: ConferenceTemplateDto,
    ) {
        return this.conferenceTemplateService.createConferenceTemplate(
            jwtAccessToken,
            user?.id,
            conferenceTemplateDto,
        );
    }

    @Roles(Role.ADMIN)
    @Get(':id')
    readConferenceTemplateById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.conferenceTemplateService.readConferenceTemplateById(
            id,
            query,
        );
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    deleteConferenceTemplate(@Param('id') id: string) {
        return this.conferenceTemplateService.deleteConferenceTemplate(id);
    }

    @Roles(Role.ADMIN)
    @Get()
    readConferenceTemplates(@Paginate() query: PaginateQuery) {
        return this.conferenceTemplateService.readConferenceTemplates(query);
    }
}
