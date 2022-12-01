import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Conference as ConferenceDto } from '@/components/exhibition/dto/conference.dto';
import { ConferenceService } from '@/components/exhibition/services/conference.service';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { JWTAuthGuard } from '@/components/user/guards/auth.guard';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';

@Controller('conferences')
export class ConferenceController {
    constructor(private readonly conferenceService: ConferenceService) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
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

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    readConferenceById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.conferenceService.readConferenceById(id, query.populate);
    }
}
