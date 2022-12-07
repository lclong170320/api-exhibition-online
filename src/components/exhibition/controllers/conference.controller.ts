import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Conference as ConferenceDto } from '@/components/exhibition/dto/conference.dto';
import { ConferenceService } from '@/components/exhibition/services/conference.service';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { JWTAuthGuard } from 'guards/auth.guard';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('conferences')
export class ConferenceController {
    constructor(private readonly conferenceService: ConferenceService) {}

    @Roles(Role.ADMIN)
    @Put(':id')
    updateConference(
        @JwtAccessToken() jwtAccessToken: string,
        @Param('id') id: string,
        @Body() conferenceDto: ConferenceDto,
    ) {
        return this.conferenceService.updateConference(
            jwtAccessToken,
            id,
            conferenceDto,
        );
    }

    @Roles(Role.ADMIN)
    @Get(':id')
    readConferenceById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.conferenceService.readConferenceById(id, query);
    }
}
