import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { Conference as ConferenceDto } from '@/components/exhibition/dto/conference.dto';
import { ConferenceService } from '@/components/exhibition/services/conference.service';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { JWTAuthGuard } from '@/components/user/guards/auth.guard';

@Controller('conferences')
export class ConferenceController {
    constructor(private readonly conferenceService: ConferenceService) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(':id')
    updateConference(
        @Param('id') id: string,
        @Body() conferenceDto: ConferenceDto,
    ) {
        return this.conferenceService.updateConference(id, conferenceDto);
    }
}
