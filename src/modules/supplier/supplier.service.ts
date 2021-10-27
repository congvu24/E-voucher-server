import { Injectable } from '@nestjs/common';
import type { PageDto } from 'common/dto/page.dto';
import type { VoucherRequestPageOptionsForManager } from 'modules/voucher/Dto/request-page-options.dto';

import type { VoucherRequestDto } from '../voucher/Dto/voucher-request-dto';
import { VoucherRequestRepository } from '../voucher/voucher-request.repository';

@Injectable()
export class SupplierService {
  constructor(
    private readonly voucherRequestRepository: VoucherRequestRepository,
  ) {}

  async getVoucherRequest(
    pageOptionsDto: VoucherRequestPageOptionsForManager,
  ): Promise<PageDto<VoucherRequestDto>> {
    const queryBuilder =
      this.voucherRequestRepository.createQueryBuilder('request');

    if (pageOptionsDto.status) {
      queryBuilder.where('status = :status', { status: pageOptionsDto.status });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }
}
