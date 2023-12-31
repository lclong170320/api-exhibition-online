import { PublicService } from '@/components/public/public.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Meeting } from '../exhibition/dto/meeting.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Registration } from '@/components/exhibition/dto/registration.dto';
@Controller()
export class PublicController {
    constructor(private readonly publicService: PublicService) {}

    @Get('/exhibitions')
    readExhibitions(@Paginate() query: PaginateQuery) {
        return this.publicService.readExhibitions(query);
    }

    @Get('/exhibitions/:id')
    readExhibitionById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.publicService.readExhibitionById(id, query);
    }

    @Get('/medias/:id')
    readMediaById(@Param('id') id: string) {
        return this.publicService.readMediaById(id);
    }

    @Get('/enterprises/:id')
    readEnterpriseById(@Param('id') id: string) {
        return this.publicService.readEnterpriseById(id);
    }

    @Post('/meetings')
    createMeeting(@Body() meeting: Meeting) {
        return this.publicService.createMeeting(meeting);
    }

    @Get('/meetings')
    readMeetings(@Paginate() query: PaginateQuery) {
        return this.publicService.readMeetings(query);
    }

    @Get('conferences/:id')
    readConferenceById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.publicService.readConferenceById(id, query);
    }

    @Get('/booth-templates')
    readBoothTemplates(@Paginate() query: PaginateQuery) {
        return this.publicService.readBoothTemplates(query);
    }

    @Post('/projects/:id/count')
    createCountProject(@Param('id') id: string) {
        return this.publicService.createCountProject(id);
    }

    @Post('/projects/:id/like')
    createLikeProject(@Param('id') id: string) {
        return this.publicService.createLikeProject(id);
    }

    @Cron(CronExpression.EVERY_DAY_AT_5PM)
    handleCron() {
        this.publicService.countViewProject();
        this.publicService.countLikeProject();
    }

    @Post('/registrations')
    createRegistration(@Body() RegistrationDto: Registration) {
        return this.publicService.createRegistration(RegistrationDto);
    }
}
