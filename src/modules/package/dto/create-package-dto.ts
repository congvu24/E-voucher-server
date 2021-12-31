/* eslint-disable max-classes-per-file */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Column } from 'typeorm';

import { Trim } from '../../../decorators/transforms.decorator';

export class PackageCreateDto {
  @ApiProperty()
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty()
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Column()
  description: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Column()
  minValue: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Column()
  maxValue: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Column()
  isShow: boolean;
}
