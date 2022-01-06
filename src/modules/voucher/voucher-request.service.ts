import { Injectable, NotFoundException } from '@nestjs/common';
import type { PageDto } from 'common/dto/page.dto';
import type { CitizenEntity } from 'modules/citizen/citizen.entity';
import type { FindConditions } from 'typeorm';
import type { Optional } from 'types';

import { VoucherRequestType } from '../../common/constants/voucher-request-type';
import type {
  VoucherRequestPageOptions,
  VoucherRequestPageOptionsForManager,
} from './Dto/request-page-options.dto';
import type { VoucherRequestCreateDto } from './Dto/voucher-request-create-dto';
import type { VoucherRequestDto } from './Dto/voucher-request-dto';
import type { VoucherEntity } from './voucher.entity';
import type { VoucherRequestEntity } from './voucher-request.entity';
import { VoucherRequestRepository } from './voucher-request.repository';

@Injectable()
export class VoucherRequestService {
  constructor(
    private readonly voucherRequestRepository: VoucherRequestRepository,
  ) {}

  /**
   * Find single request
   */
  findOne(
    findData: FindConditions<VoucherRequestEntity>,
  ): Promise<Optional<VoucherRequestEntity>> {
    return this.voucherRequestRepository.findOne(findData, {
      relations: ['voucher', 'citizen'],
    });
  }

  async createRequest(
    user: CitizenEntity,
    data: VoucherRequestCreateDto,
  ): Promise<VoucherRequestDto> {
    const request = this.voucherRequestRepository.create(data);
    request.citizen = user;

    return (await this.voucherRequestRepository.save(request)).toDto();
  }

  async getVoucherRequest(
    user: CitizenEntity,
    pageOptions: VoucherRequestPageOptions,
  ): Promise<PageDto<VoucherRequestDto>> {
    const queryBuilder = this.voucherRequestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.voucher', 'voucher')
      .where({ citizen: user });

    if (pageOptions.status) {
      queryBuilder.andWhere('status = :status', { status: pageOptions.status });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptions);

    return items.toPageDto(pageMetaDto);
  }

  async deleteRequest(user: CitizenEntity, id: string): Promise<void> {
    const request = await this.voucherRequestRepository.findOne(id, {
      relations: ['citizen'],
    });

    if (!request || request.citizen.id !== user.id) {
      throw new NotFoundException();
    }

    await this.voucherRequestRepository.delete(request.id);
  }

  async setVoucher(
    request: VoucherRequestEntity,
    voucher: VoucherEntity,
  ): Promise<void> {
    request.voucher = voucher;
    request.status = VoucherRequestType.ACCEPTED;
    await this.voucherRequestRepository.save(request);
  }

  async countNewRequest(): Promise<number> {
    return this.voucherRequestRepository.count({
      where: { status: VoucherRequestType.PENDING },
    });
  }

  async getAllVoucherRequest(
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

  async rejectRequest(id: string): Promise<VoucherRequestDto> {
    const request = await this.voucherRequestRepository.findOne(id, {
      relations: ['citizen'],
    });

    if (!request || request.status !== VoucherRequestType.PENDING) {
      throw new NotFoundException();
    }

    await this.voucherRequestRepository.update(
      { id },
      { status: VoucherRequestType.REJECTED },
    );

    return request?.toDto();
  }
}
