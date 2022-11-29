import { ConferenceTemplate as ConferenceTemplateDto } from '@/components/exhibition/dto/conference-template.dto';
import { Role } from '@/components/exhibition/dto/role.dto';
import { User } from '@/components/user/dto/user.dto';
import { JWTAuthGuard } from '@/components/user/guards/auth.guard';
import { CurrentUser } from '@/decorators/current-user';
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
import { ConferenceTemplateService } from '../services/conference-template.service';

@Controller('conference-templates')
export class ConferenceTemplateController {
    constructor(
        private readonly conferenceTemplateService: ConferenceTemplateService,
    ) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    createConferenceTemplate(
        @CurrentUser() user: User,
        @Body() conferenceTemplateDto: ConferenceTemplateDto,
    ) {
        return this.conferenceTemplateService.createConferenceTemplate(
            user?.id,
            conferenceTemplateDto,
        );
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    readConferenceTemplateById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.conferenceTemplateService.readConferenceTemplateById(
            id,
            query.populate,
        );
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    deleteConferenceTemplate(@Param('id') id: string) {
        return this.conferenceTemplateService.deleteConferenceTemplate(id);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    readConferenceTemplates(@Paginate() query: PaginateQuery) {
        return this.conferenceTemplateService.readConferenceTemplates(query);
    }
}
