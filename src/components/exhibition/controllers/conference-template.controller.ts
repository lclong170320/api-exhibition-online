import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { ConferenceTemplateService } from '../services/conference-template.service';
import { ConferenceTemplate as ConferenceTemplateDto } from '@/components/exhibition/dto/conference-template.dto';
import { UserIdFromToken } from '@/decorators/user-from-token.decorator';

@Controller('conference-templates')
export class ConferenceTemplateController {
    constructor(
        private readonly conferenceTemplateService: ConferenceTemplateService,
    ) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    createConferenceTemplate(
        @UserIdFromToken() userId: number,
        @Body() conferenceTemplateDto: ConferenceTemplateDto,
    ) {
        return this.conferenceTemplateService.createConferenceTemplate(
            userId,
            conferenceTemplateDto,
        );
    }
}
