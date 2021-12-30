/* eslint-disable max-classes-per-file */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

import { Trim } from '../../../decorators/transforms.decorator';

export class ClaimVoucherDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  readonly voucherId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  readonly packageId: string;

  @ApiProperty()
  @IsString()
  @Trim()
  readonly supplierId: string;

  @ApiProperty()
  @IsString()
  @Trim()
  readonly key: string;

  @ApiProperty()
  @IsString()
  @Trim()
  readonly citizenId: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly token: string;
}
