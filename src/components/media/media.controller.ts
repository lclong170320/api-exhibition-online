import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Media as MediaDto } from './dto/media.dto';
import { MediaService } from './media.service';

@Controller('medias')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}
    @Post()
    createMedia(@Body() data: MediaDto) {
        return this.mediaService.createMedia(data);
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
