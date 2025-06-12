import { Controller, Get, Query } from '@nestjs/common';
import { BandwidthService } from './bandwidth.service';

@Controller('/api/bandwidth')
export class BandwidthController {
  constructor(private readonly bandwidthService: BandwidthService) {}

  @Get('trafego')
  async getTrafego(
    @Query('rxMbps') rxMbps: string,
    @Query('txMbps') txMbps: string,
  ) {
    console.log(`rxMbps: ${rxMbps}, txMbps: ${txMbps}`);
    const values = await this.bandwidthService.getValues(rxMbps, txMbps);
    const time = new Date().toISOString();
    return { time, valores: values};
  }

  @Get('teste')
  async getTeste() {
    const value = Math.floor(Math.random() * 10000) + 5000;
    const time = new Date().toISOString();
    return { time, bytes: value };
  }

  
}
