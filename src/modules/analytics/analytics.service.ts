import { Injectable } from '@nestjs/common';

import { CitizenService } from '../../modules/citizen/citizen.service';
import { PackageService } from '../../modules/package/package.service';
import { UserService } from '../../modules/user/user.service';
import { VoucherService } from '../../modules/voucher/voucher.service';
import { VoucherRequestService } from '../../modules/voucher/voucher-request.service';
import type IAgencyAnalytic from './dto/agencyAnalytics';
import type IDealerAnalytic from './dto/dealerAnalytics.dto';
import type ISupplierAnalytic from './dto/supplierAnalytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    public readonly voucherService: VoucherService,
    public readonly citizenService: CitizenService,
    public readonly requestService: VoucherRequestService,
    public readonly userService: UserService,
    public readonly servicePackageService: PackageService,
  ) {}

  async getSupplierAnalytics(): Promise<ISupplierAnalytic> {
    const newRequest = await this.requestService.countNewRequest();
    const newCitizen = await this.citizenService.countNewCitizen();
    const countVoucher = await this.voucherService.countVoucher();
    const countDealer = await this.userService.countDealer();

    return {
      newRequest,
      newCitizen,
      countVoucher,
      countDealer,
    };
  }

  async getDealerAnalytics(id: string): Promise<IDealerAnalytic> {
    const allOrder = await this.voucherService.countClaimedVoucher(id);
    const countThisMonthClaim =
      await this.voucherService.countClaimedVoucherInMonth(id);
    const sumClaimVoucher = await this.voucherService.sumClaimVoucher(id);
    const sumClaimVoucherInMonth =
      await this.voucherService.sumClaimVoucherInMonth(id);
    const numberPackage = await this.servicePackageService.countAllPackage(id);
    const sumMoneyByPackage = await this.voucherService.sumMoneyByPackage(id);

    return {
      allOrder,
      thisMonthOrder: countThisMonthClaim,
      sumValue: sumClaimVoucher ?? 0,
      thisMonthValue: sumClaimVoucherInMonth ?? 0,
      numberPackage,
      sumMoneyByPackage,
    };
  }

  async getAgencyAnalytics(): Promise<IAgencyAnalytic> {
    const thisMonthCitizen = await this.citizenService.countNewCitizen();
    const allCitizen = await this.citizenService.countAllCitizen();
    const pendingCitizen = await this.citizenService.countPendingCitizen();
    const countRegisterByStatus =
      await this.citizenService.countRegisterByStatus();

    return {
      thisMonthCitizen,
      allCitizen,
      pendingCitizen,
      countRegisterByStatus,
    };
  }
}
