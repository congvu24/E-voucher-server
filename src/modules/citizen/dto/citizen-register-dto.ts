/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';

import { Trim } from '../../../decorators/transforms.decorator';

export class CitizenRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly identify: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly dob: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly job: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly address: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  readonly email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsOptional()
  phone: string;
}
