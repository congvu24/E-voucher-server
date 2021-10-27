/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

import { Trim } from '../../../decorators/transforms.decorator';

export class VoucherCreateDto {
  @ApiProperty()
  @IsString()
  @Trim()
  @IsUUID()
  readonly requestId: string;
}

export class VoucherBulkCreateDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsUUID('all', { each: true })
  readonly requestIds: string[];
}
