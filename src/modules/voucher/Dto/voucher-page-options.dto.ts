/* eslint-disable max-classes-per-file */
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { VoucherRequestType } from '../../../common/constants/voucher-request-type';
import { VoucherStatusType } from '../../../common/constants/voucher-status-type';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class VoucherPageOptions extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: VoucherStatusType,
    default: undefined,
  })
  @IsEnum(VoucherStatusType)
  @IsOptional()
  readonly status?: VoucherStatusType;
}
