
import { Module } from '@nestjs/common';
import { BandwidthService } from './bandwidth.service';
import { BandwidthController } from './bandwidth.controller';

@Module({
  providers: [BandwidthService],
  controllers: [BandwidthController],
})
export class BandwidthModule {}
