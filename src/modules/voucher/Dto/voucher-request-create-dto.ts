/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

import { Trim } from '../../../decorators/transforms.decorator';

export class VoucherRequestCreateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  @Column()
  readonly note: string;
}
