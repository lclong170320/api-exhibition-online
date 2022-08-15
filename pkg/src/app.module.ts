import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConnections } from '@/database/connections';
import { ExhibitionModule } from '@/components/exhibition/exhibition.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ...DatabaseConnections,
        ExhibitionModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
