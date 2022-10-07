import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { BoothService } from '@/components/exhibition/services/booth.service';

@Controller('booths')
export class BoothController {
    constructor(private readonly boothService: BoothService) {}

    @Get(':id')
    getBoothById(@Param('id') id: string) {
        return this.boothService.getBoothById(id);
    }

    @Put(':id')
    updateBooth(@Param('id') id: string, @Body() boothDto: BoothDto) {
        return this.boothService.updateBooth(id, boothDto);
    }
}
