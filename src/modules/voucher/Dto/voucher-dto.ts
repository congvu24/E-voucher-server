import { ApiPropertyOptional } from '@nestjs/swagger';

import { HelpLevelType } from '../../../common/constants/help-level-type';
import { VoucherStatusType } from '../../../common/constants/voucher-status-type';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserDto } from '../../../modules/user/dto/user-dto';
import { CitizenDto } from '../../citizen/dto/citizen-dto';
import type { VoucherEntity } from '../voucher.entity';

export type VoucherDtoOptions = Partial<{ status: VoucherStatusType }>;

export class VoucherDto extends AbstractDto {
  @ApiPropertyOptional({ enum: VoucherStatusType })
  status: VoucherStatusType;

  @ApiPropertyOptional()
  type: HelpLevelType;

  @ApiPropertyOptional()
  value: number;

  @ApiPropertyOptional()
  validDate: Date;

  @ApiPropertyOptional()
  token?: string;

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
    this.validDate = voucher.validDate;
    this.type = voucher.type;
    this.token = voucher.token;
    this.citizen = voucher.citizen?.toDto();
    this.supplier = voucher.supplier?.toDto();
    this.dealer = voucher.dealer?.toDto();
  }
}
