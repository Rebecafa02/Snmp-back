import { Injectable, Logger } from '@nestjs/common';
import * as bandwidth from 'net-snmp';

@Injectable()
export class BandwidthService {
  private readonly logger = new Logger(BandwidthService.name);
  private session: bandwidth.Session;
  private readonly target = '192.168.88.1'; // IP Mikrotik
  private readonly community = 'public';
  private readonly oidRx = '1.3.6.1.2.1.2.2.1.10.'; // ifInOctets interface 2
  private readonly oidTx = '1.3.6.1.2.1.2.2.1.16.';

  constructor() {
    this.session = bandwidth.createSession(this.target, this.community);
  }

  async getValues(MbpsRx: string, MbpsTx: string) {
    const valueRxBytes = await this.getRxBytes(MbpsRx);
    const valueTxBytes = await this.getTxBytes(MbpsTx);
    return {rxBytes : valueRxBytes, txBytes: valueTxBytes};
  }

  async getRxBytes(porta: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.session.get([this.oidRx + porta], (error, varbinds) => {
        if (error) {
          this.logger.error('Erro SNMP: ' + error.message);
          return reject(error);
        }
        if (varbinds && varbinds.length > 0) {
          const value = varbinds[0].value as number;
          this.logger.log(`RX Value: ${value}`);
          resolve(value);
        } else {
          reject(new Error('No varbinds'));
        }
      });
    });
  }

  async getTxBytes(porta: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.session.get([this.oidTx + porta], (error, varbinds) => {
        if (error) {
          this.logger.error('Erro SNMP: ' + error.message);
          return reject(error);
        }
        if (varbinds && varbinds.length > 0) {
          const value = varbinds[0].value as number;
          this.logger.log(`TX Value: ${value}`);
          resolve(value);
        } else {
          reject(new Error('No varbinds'));
        }
      });
    });
  }
}
