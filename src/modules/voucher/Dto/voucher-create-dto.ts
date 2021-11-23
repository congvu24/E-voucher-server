/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString, IsUUID } from 'class-validator';

import { HelpLevelType } from '../../../common/constants/help-level-type';
import { Trim } from '../../../decorators/transforms.decorator';

export class VoucherCreateDto {
  @ApiProperty()
  @IsString()
  @Trim()
  @IsUUID()
  readonly requestId: string;

  @ApiProperty()
  @IsEnum(HelpLevelType)
  @Trim()
  readonly type: HelpLevelType;
}

export class VoucherBulkCreateDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsUUID('all', { each: true })
  readonly requestIds: string[];
}
