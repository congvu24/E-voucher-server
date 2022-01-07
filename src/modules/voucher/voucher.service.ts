/* eslint-disable unicorn/no-array-for-each */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PageDto } from 'common/dto/page.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { HelpLevelValue } from '../../common/constants/help-level-type';
import { VOUCHER_VALID_DAY } from '../../common/constants/number';
import { VoucherStatusType } from '../../common/constants/voucher-status-type';
import type { CitizenEntity } from '../../modules/citizen/citizen.entity';
import { LedgerService } from '../../modules/ledger/ledger.service';
import { PackageService } from '../../modules/package/package.service';
import { QrcodeService } from '../../modules/qrcode/qrcode.service';
import { RedisCacheService } from '../../modules/redis-cache/redis-cache.service';
import { WebsocketService } from '../../modules/websocket/websocket.service';
import { ContextProvider } from '../../providers/context.provider';
import { UtilsProvider } from '../../providers/utils.provider';
import type { ClaimVoucherDto } from './Dto/claim-voucher-dto';
import type { VoucherClaimDto } from './Dto/voucher-claim-dto';
import type { VoucherBulkCreateDto } from './Dto/voucher-create-dto';
import { VoucherCreateDto } from './Dto/voucher-create-dto';
import type { VoucherDto } from './Dto/voucher-dto';
import type { VoucherPageOptions } from './Dto/voucher-page-options.dto';
import type { VoucherQR } from './Dto/voucher-qr-dto';
import { VoucherRepository } from './voucher.repository';
import { VoucherClaimRepository } from './voucher-claim.repository';
import { VoucherRequestService } from './voucher-request.service';

@Injectable()
export class VoucherService {
  constructor(
    private readonly voucherRepository: VoucherRepository,
    private readonly voucherRequestService: VoucherRequestService,
    private readonly voucherClaimRepository: VoucherClaimRepository,
    private readonly packageService: PackageService,
    private readonly ledgerService: LedgerService,
    private readonly qrCodeService: QrcodeService,
    private readonly websocket: WebsocketService,
    private readonly cache: RedisCacheService, // private readonly cacheManager: Cache,
  ) {}

  @Transactional()
  async createVoucher(data: VoucherCreateDto): Promise<VoucherDto> {
    const request = await this.voucherRequestService.findOne({
      id: data.requestId,
    });

    if (!request || request.voucher) {
      throw new NotFoundException();
    }

    const voucher = this.voucherRepository.create();

    voucher.type = data.type;
    voucher.validDate = new Date(
      Date.now() + 1000 * 3600 * 24 * VOUCHER_VALID_DAY,
    );

    voucher.value = HelpLevelValue[data.type ?? request.type];
    voucher.supplier = ContextProvider.getAuthUser();
    voucher.citizen = request.citizen;
    voucher.token = UtilsProvider.encryptData(
      {
        supplier_id: voucher.supplier.id,
        citizen_id: voucher.citizen.id,
        key: data.requestId,
      },
      request.citizen.secret,
    );

    await this.voucherRepository.save(voucher);
    await this.voucherRequestService.setVoucher(request, voucher);

    await this.ledgerService.createVoucher(data.requestId, voucher);

    return voucher.toDto();
  }

  async createBulkVoucher(data: VoucherBulkCreateDto): Promise<VoucherDto[]> {
    //     const listResult: VoucherDto[] = [];
    //     const listErr: string[] = [];
    //     // eslint-disable-next-line @typescript-eslint/no-misused-promises
    //     const query = data.requestIds.map(async (id) => {
    //       try {
    //         const newVoucher = await this.createVoucher({
    //     requestId: id,
    //     type: .SUPPORT
    // });
    //         listResult.push(newVoucher);
    //       } catch {
    //         listErr.push('Can not create voucher for id: ', id);
    //       }
    //     });
    //     await Promise.all(query);
    //     return listResult;
    return [];
  }

  async getMyVoucher(
    citizen: CitizenEntity,
    pageOptions: VoucherPageOptions,
  ): Promise<PageDto<VoucherDto>> {
    this.websocket.claimSuccess('dasdasd');

    const queryBuilder = this.voucherRepository
      .createQueryBuilder('voucher')
      .where({ citizen });

    if (pageOptions.status) {
      queryBuilder.andWhere('status = :status', {
        status: pageOptions.status,
      });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptions);

    return items.toPageDto(pageMetaDto);
  }

  async getAllVoucher(
    pageOptions: VoucherPageOptions,
  ): Promise<PageDto<VoucherDto>> {
    const queryBuilder = this.voucherRepository.createQueryBuilder('voucher');

    if (pageOptions.status) {
      queryBuilder.andWhere('status = :status', {
        status: pageOptions.status,
      });
    }

    if (pageOptions.type) {
      queryBuilder.andWhere('type = :type', {
        type: pageOptions.type,
      });
    }

    queryBuilder.leftJoinAndSelect('voucher.citizen', 'citizen');

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptions);

    return items.toPageDto(pageMetaDto);
  }

  async getAllVoucherClaimed(
    dealerId: string,
    pageOptions: VoucherPageOptions,
  ): Promise<PageDto<VoucherDto>> {
    const queryBuilder =
      this.voucherClaimRepository.createQueryBuilder('claim');

    queryBuilder
      .leftJoinAndSelect('claim.servicePackage', 'package')
      .where('package.dealer_id = :dealerId', { dealerId });

    if (pageOptions.citizenName) {
      queryBuilder.andWhere('claim.citizen_name = :name', {
        name: pageOptions.citizenName,
      });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptions);

    return items.toPageDto(pageMetaDto);
  }

  async getMyVoucherClaimed(
    userEmail: string,
    pageOptions: VoucherPageOptions,
  ): Promise<PageDto<VoucherDto>> {
    const queryBuilder =
      this.voucherClaimRepository.createQueryBuilder('claim');

    queryBuilder.where('claim.citizen_email = :email', { email: userEmail });
    queryBuilder.leftJoinAndSelect('claim.servicePackage', 'package');

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptions);

    return items.toPageDto(pageMetaDto);
  }

  async cancelVoucher(citizen: CitizenEntity, id: string): Promise<VoucherDto> {
    const voucher = await this.voucherRepository.findOne(id, {
      relations: ['citizen'],
    });

    if (!voucher || voucher?.citizen.id !== citizen.id) {
      throw new NotFoundException();
    }

    voucher.status = VoucherStatusType.CANCEL;
    //need to commit cancel to ledger
    await this.voucherRepository.save(voucher);

    return voucher.toDto();
  }

  async deleteVoucher(id: string): Promise<VoucherDto> {
    const voucher = await this.voucherRepository.findOne(id, {
      relations: ['citizen'],
    });

    if (!voucher) {
      throw new NotFoundException();
    }

    voucher.status = VoucherStatusType.DELETED;

    await this.voucherRepository.save(voucher);

    const data: any = UtilsProvider.decryptData(
      voucher.token,
      voucher?.citizen.secret || '',
    );

    await this.ledgerService.deleteVoucher(data.key);

    return voucher.toDto();
  }

  async claimVoucher(data: ClaimVoucherDto): Promise<VoucherClaimDto> {
    const dealer = ContextProvider.getAuthUser();

    const voucher = await this.ledgerService.getVoucher(
      data.key,
      data.supplierId,
      data.citizenId,
    );

    const voucherInDB = await this.voucherRepository.findOne(data.voucherId, {
      relations: ['citizen'],
    });

    const servicePackage = await this.packageService.findOne({
      id: data.packageId,
    });

    if (!voucher || !servicePackage || servicePackage.dealer.id !== dealer.id) {
      throw new NotFoundException();
    }

    if (
      voucher.value < servicePackage.minValue ||
      voucher.value > servicePackage.maxValue
    ) {
      throw new HttpException(
        'This package is beyond the value of voucher',
        HttpStatus.CONFLICT,
      );
    }

    if (voucher.validDate < new Date()) {
      throw new HttpException(
        'This voucher is out of date',
        HttpStatus.CONFLICT,
      );
    }

    if (voucher.status !== VoucherStatusType.UNUSE) {
      throw new HttpException('This voucher is redeemed', HttpStatus.CONFLICT);
    }

    voucher.status = VoucherStatusType.USED;

    await this.voucherRepository.update(
      { id: data.voucherId },
      {
        status: VoucherStatusType.USED,
        package: servicePackage,
        dealer: servicePackage.dealer,
      },
    );
    await this.ledgerService.commitVoucher(
      data.key,
      servicePackage.dealer.id,
      servicePackage.id,
    );
    const claim = this.voucherClaimRepository.create();
    const newClaim = {
      servicePackage,
      voucherId: data.voucherId,
      value: voucher.value,
      citizenName: voucherInDB?.citizen.name,
      citizenEmail: voucherInDB?.citizen.email,
    };

    Object.assign(claim, newClaim);

    await this.voucherClaimRepository.save(claim);

    this.websocket.claimSuccess(data.voucherId);

    return claim.toDto();
  }

  async getVoucherQR(id: string): Promise<VoucherQR> {
    const voucher = await this.voucherRepository.findOne(id, {
      relations: ['citizen'],
    });

    if (!voucher) {
      throw new NotFoundException();
    }

    const data: any = UtilsProvider.decryptData(
      voucher.token,
      voucher?.citizen.secret || '',
    );

    let url = '';
    const find = await this.cache.get(id);

    if (find !== undefined) {
      url = await this.cache.get(id);
    } else {
      url = await this.qrCodeService.createQRCode({
        key: data.key,
        supplier_id: data.supplier_id,
        citizen_id: data.citizen_id,
        voucher_id: id,
        citizen: voucher.citizen.toDto(),
      });

      await this.cache.set(id, url);
    }

    const voucherQR: VoucherQR = {
      voucherId: voucher.id,
      url,
      timeout: 30,
    };

    return voucherQR;
  }

  async countVoucher(): Promise<number> {
    return this.voucherRepository.count();
  }

  async countClaimedVoucher(dealerId: string): Promise<number> {
    const queryBuilder =
      this.voucherClaimRepository.createQueryBuilder('claim');

    return queryBuilder
      .leftJoinAndSelect('claim.servicePackage', 'package')
      .where('package.dealer_id = :dealerId', { dealerId })
      .getCount();
  }

  async countClaimedVoucherInMonth(dealerId: string): Promise<number> {
    const lastMonthDay = new Date(
      Date.now() - 30 * 24 * 3600 * 1000,
    ).toISOString();
    const queryBuilder =
      this.voucherClaimRepository.createQueryBuilder('claim');

    return queryBuilder
      .leftJoinAndSelect('claim.servicePackage', 'package')
      .where('package.dealer_id = :dealerId', { dealerId })
      .andWhere('claim.created_at >= :lastMonthDay', { lastMonthDay })
      .getCount();
  }

  async sumClaimVoucher(dealerId: string): Promise<number> {
    const { sum } = await this.voucherClaimRepository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.servicePackage', 'package')
      .where('package.dealer_id = :dealerId', { dealerId })
      .select('SUM(claim.value)', 'sum')
      .getRawOne();

    return Number.parseInt(String(sum), 10);
  }

  async sumClaimVoucherInMonth(dealerId: string): Promise<number> {
    const lastMonthDay = new Date(
      Date.now() - 30 * 24 * 3600 * 1000,
    ).toISOString();

    const { sum } = await this.voucherClaimRepository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.servicePackage', 'package')
      .where('package.dealer_id = :dealerId', { dealerId })
      .andWhere('claim.created_at >= :lastMonthDay', { lastMonthDay })
      .select('SUM(claim.value)', 'sum')
      .getRawOne();

    return Number.parseInt(String(sum), 10);
  }

  async sumMoneyByPackage(dealerId: string): Promise<any> {
    return this.voucherClaimRepository
      .createQueryBuilder('claim')
      .select('package.id')
      .addSelect('package.name')
      .addSelect('SUM(claim.value)', 'sum')
      .leftJoin('claim.servicePackage', 'package')
      .groupBy('package.id')
      .andWhere('package.dealer_id = :dealerId', { dealerId })
      .getRawMany();
    //   .leftJoin('claim.servicePackage', 'package')
    //   .where('package.dealer_id = :dealer_id', { dealer_id: dealerId })
  }
}
