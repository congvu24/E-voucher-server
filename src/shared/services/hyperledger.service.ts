/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable, Logger } from '@nestjs/common';
import type { Contract } from 'fabric-network';
import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import path from 'path';

import { LedgerNotReadyExption } from '../../exceptions/ledger-not-ready.exception';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class HyperledgerService {
  contract: Contract;

  walletPath: string;

  connectionPath: string;

  orgName: string;

  readonly channelName = 'mychannel';

  readonly role = 'Admin';

  readonly contractName = 'voucher';

  constructor(public configService: ApiConfigService) {
    this.connectionPath = configService.hyperledgerConfig.connectionPath;
    this.orgName = configService.hyperledgerConfig.orgName;
    this.walletPath = path.join(
      configService.hyperledgerConfig.walletPath,
      this.orgName,
    );

    this.initWallet();
  }

  async initWallet(): Promise<void> {
    try {
      const ccp = JSON.parse(fs.readFileSync(this.connectionPath).toString());
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);
      const identity = await wallet.get(this.role);

      if (!identity) {
        Logger.error('Admin identity can not be found in the wallet');

        return;
      }

      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: this.role,
        discovery: { enabled: true, asLocalhost: false },
      });

      const network = await gateway.getNetwork(this.channelName);

      this.contract = network.getContract(this.contractName);

      Logger.log('Init hyperledger service success');
    } catch (error) {
      Logger.error('Init hyperledger failed', error);

      throw new LedgerNotReadyExption();
    }
  }
}
