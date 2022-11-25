import { ConferenceTemplate as ConferenceTemplateDto } from '@/components/exhibition/dto/conference-template.dto';
import { Role } from '@/components/exhibition/dto/role.dto';
import { User } from '@/components/user/dto/user.dto';
import { JWTAuthGuard } from '@/components/user/guards/auth.guard';
import { CurrentUser } from '@/decorators/current-user';
import { Roles } from '@/decorators/roles.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
