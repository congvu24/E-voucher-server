/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

import { HelpLevelType } from '../../../common/constants/help-level-type';
import { Trim } from '../../../decorators/transforms.decorator';

export class VoucherRequestCreateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  @Column()
  readonly note: string;

  @ApiProperty()
  @IsEnum(HelpLevelType)
  @Column()
  readonly type: HelpLevelType;
}
