import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { VoucherStatusType } from '../../common/constants/voucher-status-type';
import { VoucherEntity } from '../../modules/voucher/voucher.entity';
import { HyperledgerService } from '../../shared/services/hyperledger.service';

// async CreateVoucher(ctx, id, citizen_id, supplier_id, dealer_id, status, value, package_id, created_at, updated_at)
// async ReadVoucher(ctx, id)
// async DeleteVoucher(ctx, id)
// async CommitVoucher(ctx, id, newStatus, dealer_id, package_id)
// async GetVouchersByRange(ctx, startKey, endKey)
// async QueryAssetsByCitizen(ctx, citizen_id)
// async QueryVoucher(ctx, queryString)
// async GetQueryResultForQueryString(ctx, queryString)
// async GetVouchersByRangeWithPagination(ctx, startKey, endKey, pageSize, bookmark)
// async QueryVouchersWithPagination(ctx, queryString, pageSize, bookmark)
// async GetVoucherHistory(ctx, voucher_id)
// async VoucherExists(ctx, voucher_id)
// async _GetAllResults(iterator, isHistory)
// async InitLedger(ctx)

@Injectable()
export class LedgerService {
  constructor(public readonly hyperledgerService: HyperledgerService) {}

  async createVoucher(key: string, voucher: VoucherEntity): Promise<void> {
    Logger.log('*** Submit transaction: create voucher');
    await this.hyperledgerService.contract.submitTransaction(
      'CreateVoucher',
      key,
      voucher.citizen.id,
      voucher.supplier?.id ?? '',
      voucher.dealer?.id ?? '',
      voucher.status,
      voucher.value?.toString() ?? '',
      voucher.package?.id ?? '',
      voucher.createdAt.toString(),
      voucher.updatedAt.toString(),
    );
    Logger.log('*** Result: summited');
  }

  async commitVoucher(key: string, voucher: VoucherEntity): Promise<void> {
    Logger.log('*** Submit transaction: commit voucher');
    await this.hyperledgerService.contract.submitTransaction(
      'CommitVoucher',
      key,
      VoucherStatusType.USED,
      voucher.dealer.id,
      voucher.package.id,
    );
    Logger.log('*** Result: committed');
  }

  async getVoucher(
    key: string,
    supplierId: string,
    citizenId: string,
  ): Promise<VoucherEntity | undefined> {
    try {
      const query = {
        selector: {
          docType: 'voucher',
          voucher_id: key,
          supplier_id: supplierId,
          citizen_id: citizenId,
        },
      };

      Logger.log('*** Evalue transaction : query voucher');
      const result = await this.hyperledgerService.contract.evaluateTransaction(
        'QueryVoucher',
        JSON.stringify(query),
      );

      if (!result) {
        return undefined;
      }

      Logger.log('Result', result.toString());

      const jsonData = JSON.parse(result.toString());

      return plainToClass(VoucherEntity, jsonData[0].Record);
    } catch (error) {
      Logger.error(error);

      return undefined;
    }
  }

  async deleteVoucher(id: string): Promise<void> {
    // Logger.log('*** Submit transaction : delete voucher');
    // const result = await this.hyperledgerService.contract.submitTransaction(
    //   'DeleteVoucher',
    //   id,
    // );
    // Logger.log('Result', result.toString());
  }
}
