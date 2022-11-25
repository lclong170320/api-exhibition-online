import { PublicService } from '@/components/public/public.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Meeting } from '../exhibition/dto/meeting.dto';

@Controller()
export class PublicController {
    constructor(private readonly publicService: PublicService) {}

    @Get('/exhibitions/:id')
    getExhibitionById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.publicService.getExhibitionById(id, query);
    }

    @Get('/medias/:id')
    getMediaById(@Param('id') id: string) {
        return this.publicService.getMediaById(id);
    }

    @Get('/enterprises/:id')
    getEnterpriseById(@Param('id') id: string) {
        return this.publicService.getEnterpriseById(id);
    }

    @Post('/meetings')
    createMeeting(@Body() meeting: Meeting) {
        return this.publicService.createMeeting(meeting);
    }

    @Get('/meetings')
    getMeetings(@Paginate() query: PaginateQuery) {
        return this.publicService.getMeetings(query);
    }

    @Get('conferences/:id')
    getConferenceById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.publicService.getConferenceById(id, query.populate);
    }

    @Get('/booth-templates')
    getBoothTemplates(@Paginate() query: PaginateQuery) {
        return this.publicService.findBoothTemplates(query);
    }
}
