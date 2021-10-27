/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Column } from 'typeorm';

import { Trim } from '../../../decorators/transforms.decorator';

export class ClaimVoucherDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  @IsUUID()
  readonly voucherId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  @IsUUID()
  readonly packageId: string;
}
