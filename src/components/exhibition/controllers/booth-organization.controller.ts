import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { BoothOrganization as BoothOrganizationDto } from '@/components/exhibition/dto/booth-organization.dto';
import { BoothOrganizationService } from '@/components/exhibition/services/booth-organization.service';
import { PaginateQuery, Paginate } from '@/decorators/paginate.decorator';

@Controller('booth-organizations')
export class BoothOrganizationController {
    constructor(
        private readonly boothOrganizationService: BoothOrganizationService,
    ) {}

    @Get(':id')
    getBoothOrganizationById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothOrganizationService.getBoothOrganizationById(
            id,
            query.populate,
        );
    }

    @Put(':id')
    updateBoothOrganization(
        @Param('id') id: string,
        @Body() boothOrganizationDto: BoothOrganizationDto,
    ) {
        return this.boothOrganizationService.updateBoothOrganization(
            id,
            boothOrganizationDto,
        );
    }
}
