/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class VoucherQR {
  @ApiProperty()
  @IsOptional()
  readonly voucherId: string;

  @ApiProperty()
  @IsOptional()
  readonly timeout: number;

  @ApiProperty()
  @IsOptional()
  readonly url: string;
}
