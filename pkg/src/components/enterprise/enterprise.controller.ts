import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EnterpriseDocument as EnterpriseDocumentDto } from './dto/enterprise-document.dto';
import { EnterpriseProfile as EnterpriseProfileDto } from './dto/enterprise-profile.dto';
import { Enterprise as EnterpriseDto } from './dto/enterprise.dto';
import { EnterpriseService } from './enterprise.service';

@Controller('enterprises')
export class EnterpriseController {
    constructor(private readonly enterpriseService: EnterpriseService) {}

    @Get()
    getEnterprises(
        @Query('offset') offset: string,
        @Query('limit') limit: string,
    ) {
        return this.enterpriseService.getEnterprises(offset, limit);
    }

    @Get(':id')
    getEnterpriseById(@Param('id') id: string) {
        return this.enterpriseService.getEnterpriseById(id);
    }

    @Post()
    createEnterprise(@Body() enterprise: EnterpriseDto) {
        return this.enterpriseService.createEnterprise(enterprise);
    }

    @Post(':id/documents')
    createDocument(
        @Param('id') id: string,
        @Body() document: EnterpriseDocumentDto,
    ) {
        return this.enterpriseService.createDocument(id, document);
    }

    @Post(':id/profiles')
    createProfile(
        @Param('id') id: string,
        @Body() profile: EnterpriseProfileDto,
    ) {
        return this.enterpriseService.createProfile(id, profile);
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
}
