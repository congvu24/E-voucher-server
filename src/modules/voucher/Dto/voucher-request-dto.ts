import { ApiPropertyOptional } from '@nestjs/swagger';

import { VoucherRequestType } from '../../../common/constants/voucher-request-type';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CitizenDto } from '../../citizen/dto/citizen-dto';
import type { VoucherRequestEntity } from '../voucher-request.entity';
import { VoucherDto } from './voucher-dto';

export type VoucherRequestDtoOptions = Partial<{ status: VoucherRequestType }>;

export class VoucherRequestDto extends AbstractDto {
  @ApiPropertyOptional()
  note: string;

  @ApiPropertyOptional({ enum: VoucherRequestType })
  status: VoucherRequestType;

  @ApiPropertyOptional()
  citizen?: CitizenDto;

  @ApiPropertyOptional()
  voucher?: VoucherDto;

  constructor(request: VoucherRequestEntity) {
    super(request);
    this.id = request.id;
    this.note = request.note;
    this.status = request.status;
    this.citizen = request.citizen?.toDto();
    this.voucher = request.voucher?.toDto();
    this.updatedAt = request.updatedAt;
    this.createdAt = request.createdAt;
  }
}
