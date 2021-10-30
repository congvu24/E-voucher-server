import { ApiPropertyOptional } from '@nestjs/swagger';

import { VoucherStatusType } from '../../../common/constants/voucher-status-type';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserDto } from '../../../modules/user/dto/user-dto';
import { CitizenDto } from '../../citizen/dto/citizen-dto';
import type { VoucherEntity } from '../voucher.entity';
import { VoucherRequestDto } from './voucher-request-dto';

export type VoucherDtoOptions = Partial<{ status: VoucherStatusType }>;

export class VoucherDto extends AbstractDto {
  @ApiPropertyOptional({ enum: VoucherStatusType })
  status: VoucherStatusType;

  @ApiPropertyOptional()
  value: number;

  @ApiPropertyOptional()
  token: string;

  @ApiPropertyOptional()
  citizen?: CitizenDto;

  @ApiPropertyOptional()
  supplier?: UserDto;

  @ApiPropertyOptional()
  dealer?: UserDto;

  constructor(voucher: VoucherEntity) {
    super(voucher);
    this.id = voucher.id;
    this.value = voucher.value;
    this.status = voucher.status;
    this.token = voucher.token;
    this.citizen = voucher.citizen?.toDto();
    this.supplier = voucher.supplier?.toDto();
    this.dealer = voucher.dealer?.toDto();
  }
}
