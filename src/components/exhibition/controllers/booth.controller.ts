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
} from '@nestjs/common';
import { RolesGuard } from 'guards/roles.guard';
import { AllowUserGetBooth } from 'interceptors/allowUserGetBooth.interceptor';
import { IsOwner } from '@/decorators/IsOwner';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('booths')
export class BoothController {
    constructor(private readonly boothService: BoothService) {}

    @Roles(Role.ADMIN, Role.USER)
    @IsOwner(AllowUserGetBooth)
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
}
