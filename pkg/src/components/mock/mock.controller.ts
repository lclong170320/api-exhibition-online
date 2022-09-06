import { Controller, Post } from '@nestjs/common';

@Controller()
export class MockController {
    @Post('/medias')
    getMedias() {
        return {
            media_id: 1,
            media_url: 'https://i.imgur.com/QbFlOGR.jpg',
        };
    }
}
