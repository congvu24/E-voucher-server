/* eslint-disable max-classes-per-file */
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { VoucherRequestType } from '../../../common/constants/voucher-request-type';
import { HelpLevelType } from '../../../common/constants/help-level-type';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class VoucherRequestPageOptions extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: VoucherRequestType,
    default: undefined,
  })
  @IsEnum(VoucherRequestType)
  @IsOptional()
  readonly status?: VoucherRequestType;

  @ApiPropertyOptional({
    enum: HelpLevelType,
    default: undefined,
  })
  @IsEnum(HelpLevelType)
  @IsOptional()
  readonly type?: HelpLevelType;
}
export class VoucherRequestPageOptionsForManager extends VoucherRequestPageOptions {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly reedemedVoucher?: boolean;
}
