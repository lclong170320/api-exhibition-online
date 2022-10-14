import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { EnterpriseDocument as EnterpriseDocumentDto } from './dto/enterprise-document.dto';
import { Enterprise as EnterpriseDto } from './dto/enterprise.dto';
import { EnterpriseService } from './enterprise.service';
@Controller('enterprises')
export class EnterpriseController {
    constructor(private readonly enterpriseService: EnterpriseService) {}

    @Get()
    getEnterprises(@Paginate() query: PaginateQuery) {
        return this.enterpriseService.getEnterprises(query);
    }

    @Get(':id/documents')
    getEnterprisesDocuments(
        @Query('offset') offset: string,
        @Query('limit') limit: string,
        @Param('id') id: string,
    ) {
        return this.enterpriseService.getEnterprisesDocuments(
            id,
            offset,
            limit,
        );
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

    @Put(':id/document/:document_id')
    async updateDocuments(
        @Param('id') id: string,
        @Param('document_id') documentId: string,
        @Body() enterpriseDocumentDto: EnterpriseDocumentDto,
    ) {
        return await this.enterpriseService.updateDocuments(
            id,
            documentId,
            enterpriseDocumentDto,
        );
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteEnterprise(@Param('id') id: string) {
        await this.enterpriseService.deleteEnterprise(id);
    }
}
