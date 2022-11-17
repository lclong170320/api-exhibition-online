import { Controller, Get, UseGuards } from '@nestjs/common';
import { BoothService } from '@/components/exhibition/services/booth.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';

import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';

@Controller('booths')
export class BoothController {
    constructor(private readonly boothService: BoothService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Get()
    getBooths(
        @JwtAccessToken() jwtAccessToken: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothService.findBooths(jwtAccessToken, query);
    }
}
