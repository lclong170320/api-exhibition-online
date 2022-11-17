import { Controller, Get } from '@nestjs/common';
import { BoothService } from '@/components/exhibition/services/booth.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';

import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';

@Controller('booths')
export class BoothController {
    constructor(private readonly boothService: BoothService) {}

    @Get()
    getBooths(
        @JwtAccessToken() jwtAccessToken: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothService.findBooths(jwtAccessToken, query.populate);
    }
}
