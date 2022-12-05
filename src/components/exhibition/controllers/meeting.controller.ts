import { User } from '@/components/exhibition/dto/user.dto';
import { JWTAuthGuard } from 'guards/auth.guard';
import { CurrentUser } from '@/decorators/current-user';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'guards/roles.guard';
import { MeetingService } from '@/components/exhibition/services/meeting.service';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('meetings')
export class MeetingController {
    constructor(private readonly meetingService: MeetingService) {}

    @Get()
    readMeetings(@CurrentUser() user: User, @Paginate() query: PaginateQuery) {
        return this.meetingService.readMeetings(user?.enterprise_id, query);
    }
}
