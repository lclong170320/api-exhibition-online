import { Role } from '@/components/exhibition/dto/role.dto';
import { BoothService } from '@/components/exhibition/services/booth.service';
import { JWTAuthGuard } from '@/components/user/guards/auth.guard';
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

@Controller('booths')
export class BoothController {
    constructor(private readonly boothService: BoothService) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.USER)
    @Get()
    getBooths(
        @JwtAccessToken() jwtAccessToken: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothService.findBooths(jwtAccessToken, query);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    deleteBooth(@Param('id') id: string) {
        return this.boothService.deleteBooth(id);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Get(':id')
    getBoothTemplateById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothService.findBoothById(id, query.populate);
    }
}
