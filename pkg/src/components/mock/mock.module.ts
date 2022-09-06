import { Module } from '@nestjs/common';
import { MockController } from './mock.controller';

@Module({
    controllers: [MockController],
    providers: [],
    imports: [],
    exports: [],
})
export class MockModule {}
