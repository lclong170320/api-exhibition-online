import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Enterprise as EnterpriseDto } from './dto/enterprise.dto';
import { EnterpriseService } from './enterprise.service';
@Controller('enterprises')
export class EnterpriseController {
    constructor(private readonly enterpriseService: EnterpriseService) {}

    @Get()
    readEnterprises(@Paginate() query: PaginateQuery) {
        return this.enterpriseService.readEnterprises(query);
    }

    @Get(':id')
    readEnterpriseById(@Param('id') id: string) {
        return this.enterpriseService.readEnterpriseById(id);
    }

    @Post()
    createEnterprise(@Body() enterprise: EnterpriseDto) {
        return this.enterpriseService.createEnterprise(enterprise);
    }

    @Post(':id/qrcodes')
    createQrCode(@Param('id') id: string) {
        return this.enterpriseService.createQrCode(id);
    }

    @Put(':id')
    updateEnterprise(
        @Param('id') id: string,
        @Body() newEnterprise: EnterpriseDto,
    ) {
        return this.enterpriseService.updateEnterprise(id, newEnterprise);
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteEnterprise(@Param('id') id: string) {
        await this.enterpriseService.deleteEnterprise(id);
    }
}
