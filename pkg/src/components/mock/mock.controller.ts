import { Controller, Post } from '@nestjs/common';

@Controller('medias')
export class MockController {
    @Post('')
    getMedias() {
        return {
            media_id: 1,
        };
    }
}
