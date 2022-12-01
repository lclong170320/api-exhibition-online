import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Media as MediaDto } from './dto/media.dto';
import { MediaService } from './media.service';
import { User } from '@/components/media/dto/user.dto';
import { CurrentUser } from '@/decorators/current-user';
@Controller('medias')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}
    @Post()
    createMedia(@Body() data: MediaDto, @CurrentUser() user: User) {
        return this.mediaService.createMedia(data, user);
    }

    @Get()
    readMedias(@Paginate() query: PaginateQuery) {
        return this.mediaService.readMedias(query);
    }

    @Get(':id')
    readById(@Param('id') id: string) {
        return this.mediaService.readById(id);
    }
}
