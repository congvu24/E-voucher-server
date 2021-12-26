/* eslint-disable max-classes-per-file */
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEnum, IsOptional } from 'class-validator';

import { VoucherStatusType } from '../../../common/constants/voucher-status-type';
import { HelpLevelType } from '../../../common/constants/help-level-type';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class VoucherPageOptions extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: VoucherStatusType,
    default: undefined,
  })
  @IsEnum(VoucherStatusType)
  @IsOptional()
  readonly status?: VoucherStatusType;

  @ApiPropertyOptional({
    enum: HelpLevelType,
    default: undefined,
  })
  @IsEnum(HelpLevelType)
  @IsOptional()
  readonly type?: HelpLevelType;
}
