import { Role } from '@/components/exhibition/dto/role.dto';
import { BoothService } from '@/components/exhibition/services/booth.service';
import { JWTAuthGuard } from 'guards/auth.guard';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Roles } from '@/decorators/roles.decorator';
import {
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    UseGuards,
    Put,
    Body,
    Post,
} from '@nestjs/common';
import { RolesGuard } from 'guards/roles.guard';
import { AllowUserGetBooth } from 'interceptors/allowUserGetBooth.interceptor';
import { IsOwner } from '@/decorators/IsOwner';
import { LiveStream as LiveStreamDto } from '../dto/live-stream.dto';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('booths')
export class BoothController {
    constructor(private readonly boothService: BoothService) {}

    @Roles(Role.ADMIN, Role.USER)
    @Get()
    readBooths(
        @JwtAccessToken() jwtAccessToken: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothService.readBooths(jwtAccessToken, query);
    }

    @Roles(Role.ADMIN, Role.USER)
    @IsOwner(AllowUserGetBooth)
    @Delete(':id')
    @HttpCode(204)
    deleteBooth(@Param('id') id: string) {
        return this.boothService.deleteBooth(id);
    }

    @Roles(Role.ADMIN, Role.USER)
    @IsOwner(AllowUserGetBooth)
    @Get(':id')
    readBoothById(@Param('id') id: string, @Paginate() query: PaginateQuery) {
        return this.boothService.readBoothById(id, query);
    }

    @Roles(Role.ADMIN, Role.USER)
    @IsOwner(AllowUserGetBooth)
    @Delete(':id/livestream/:livestreamId')
    @HttpCode(204)
    deleteLiveStream(
        @Param('id') id: string,
        @Param('livestreamId') liveStreamId: string,
    ) {
        return this.boothService.deleteLiveStream(id, liveStreamId);
    }

    @Roles(Role.ADMIN, Role.USER)
    @IsOwner(AllowUserGetBooth)
    @Get(':id/livestream/:livestreamId')
    readLiveStreamByIdBooth(
        @Param('id') boothId: string,
        @Param('livestreamId') liveStreamId: string,
    ) {
        return this.boothService.readLiveStreamByIdBooth(boothId, liveStreamId);
    }

    @Roles(Role.ADMIN, Role.USER)
    @IsOwner(AllowUserGetBooth)
    @Put(':id/livestream/:livestreamId')
    updateLiveStream(
        @Param('id') id: string,
        @Param('livestreamId') livestreamId: string,
        @Body() liveStreamDto: LiveStreamDto,
    ) {
        return this.boothService.updateLiveStream(
            id,
            livestreamId,
            liveStreamDto,
        );
    }

    @Roles(Role.ADMIN, Role.USER)
    @IsOwner(AllowUserGetBooth)
    @Post(':id/livestream')
    createLiveStream(
        @Param('id') id: string,
        @Body() liveStreamDto: LiveStreamDto,
    ) {
        return this.boothService.createLiveStream(id, liveStreamDto);
    }
}
