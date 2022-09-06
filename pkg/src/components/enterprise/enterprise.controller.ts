import { Body, Controller, Param, Post } from '@nestjs/common';
import { EnterpriseDocument as NewEnterpriseDocumentDto } from './dto/enterprise-document.dto';
import { EnterpriseService } from './enterprise.service';

@Controller('enterprises')
export class EnterpriseController {
    constructor(private readonly enterpriseService: EnterpriseService) {}

    @Post(':id/documents')
    createDocument(
        @Param('id') id: string,
        @Body() newDocument: NewEnterpriseDocumentDto,
    ) {
        return this.enterpriseService.createDocument(id, newDocument);
    }
}
