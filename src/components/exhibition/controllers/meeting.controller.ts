import { User } from '@/components/exhibition/dto/user.dto';
import { JWTAuthGuard } from '@/components/user/guards/auth.guard';
import { CurrentUser } from '@/decorators/current-user';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'guards/roles.guard';
import { MeetingService } from '../services/meeting.service';

@Controller('meetings')
export class MeetingController {
    constructor(private readonly meetingService: MeetingService) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Get()
    getMeetings(@CurrentUser() user: User, @Paginate() query: PaginateQuery) {
        return this.meetingService.getMeetings(user?.enterprise_id, query);
    }
}
