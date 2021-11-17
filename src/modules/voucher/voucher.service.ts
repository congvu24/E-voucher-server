/* eslint-disable unicorn/no-array-for-each */
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import type { PageDto } from 'common/dto/page.dto';
import type { CitizenEntity } from 'modules/citizen/citizen.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { VoucherStatusType } from '../../common/constants/voucher-status-type';
import { LedgerService } from '../../modules/ledger/ledger.service';
import { PackageService } from '../../modules/package/package.service';
import { QrcodeService } from '../../modules/qrcode/qrcode.service';
import { RedisCacheService } from '../../modules/redis-cache/redis-cache.service';
import { ContextProvider } from '../../providers/context.provider';
import { UtilsProvider } from '../../providers/utils.provider';
import type { ClaimVoucherDto } from './Dto/claim-voucher-dto';
import type { VoucherBulkCreateDto } from './Dto/voucher-create-dto';
import { VoucherCreateDto } from './Dto/voucher-create-dto';
import type { VoucherDto } from './Dto/voucher-dto';
import type { VoucherPageOptions } from './Dto/voucher-page-options.dto';
import type { VoucherQR } from './Dto/voucher-qr-dto';
import { VoucherRepository } from './voucher.repository';
import { VoucherRequestService } from './voucher-request.service';

@Injectable()
export class VoucherService {
  constructor(
    private readonly voucherRepository: VoucherRepository,
    private readonly voucherRequestService: VoucherRequestService,
    private readonly packageService: PackageService,
    private readonly ledgerService: LedgerService,
    private readonly qrCodeService: QrcodeService,
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
    const listResult: VoucherDto[] = [];
    const listErr: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const query = data.requestIds.map(async (id) => {
      try {
        const newVoucher = await this.createVoucher({ requestId: id });
        listResult.push(newVoucher);
      } catch {
        listErr.push('Can not create voucher for id: ', id);
      }
    });

    await Promise.all(query);

    return listResult;
  }

  async getMyVoucher(
    citizen: CitizenEntity,
    pageOptions: VoucherPageOptions,
  ): Promise<PageDto<VoucherDto>> {
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
    await this.ledgerService.deleteVoucher(voucher.id);

    return voucher.toDto();
  }

  async claimVoucher(data: ClaimVoucherDto): Promise<VoucherDto> {
    // const voucher = await this.voucherRepository.findOne(data.voucherId, {
    //   relations: ['citizen'],
    // });

    // if (data.token) {
    //   data = {
    //     ...data,
    //     ...UtilsProvider.decryptData(data.token, voucher?.citizen.secret || ''),
    //   };
    //   console.log(data);
    // }

    const dealer = ContextProvider.getAuthUser();

    const voucher = await this.ledgerService.getVoucher(
      data.key,
      data.supplierId,
      data.citizenId,
    );

    const servicePackage = await this.packageService.findOne({
      id: data.packageId,
    });

    if (!voucher || !servicePackage || servicePackage.dealer.id !== dealer.id) {
      throw new NotFoundException();
    }

    if (voucher.status !== VoucherStatusType.UNUSE) {
      throw new HttpException('This voucher is redeemed', HttpStatus.CONFLICT);
    }

    voucher.status = VoucherStatusType.USED;
    voucher.package = servicePackage;
    voucher.dealer = dealer;

    await this.voucherRepository.update(
      { id: data.voucherId },
      {
        status: VoucherStatusType.USED,
        package: servicePackage,
        dealer: servicePackage.dealer,
      },
    );
    await this.ledgerService.commitVoucher(data.key, voucher);

    return voucher.toDto();
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
}