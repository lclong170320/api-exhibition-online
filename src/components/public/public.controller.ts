// import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { PublicService } from '../public/public.service';

@Controller()
export class PublicController {
    constructor(private readonly publicService: PublicService) {}

    // @Get('/exhibitions/:id')
    // getExhibitionById(
    //     @Param('id') id: string,
    //     @Paginate() query: PaginateQuery,
    // ) {
    //     return this.publicService.getExhibitionById(id, query);
    // }

    @Get('/medias/:id')
    getMediaById(@Param('id') id: string) {
        return this.publicService.getMediaById(id);
    }
}
