import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BandwidthModule } from './bandwidth/bandwidth.module';

@Module({
  imports: [BandwidthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
