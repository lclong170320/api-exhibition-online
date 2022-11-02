import { Controller, Post, Body } from '@nestjs/common';
import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { BoothService } from '@/components/exhibition/services/booth.service';

@Controller('booths')
export class BoothController {
    constructor(private readonly boothService: BoothService) {}

    @Post()
    createBooth(@Body() boothDto: BoothDto) {
        return this.boothService.createBooth(boothDto);
    }
}
