import { Controller, Post, Body } from '@nestjs/common';
import { Media as MediaDto } from './dto/media.dto';
import { MediaService } from './media.service';

@Controller('medias')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}
    @Post()
    createMedia(@Body() data: MediaDto) {
        return this.mediaService.createMedia(data);
    }
}
