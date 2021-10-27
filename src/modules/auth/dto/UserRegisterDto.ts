/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';

import { RoleType } from '../../../common/constants/role-type';
import { Trim } from '../../../decorators/transforms.decorator';

export class UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly name: string;

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

export class UserCreateDto extends UserRegisterDto {
  @ApiProperty()
  @Column()
  @IsEnum(RoleType)
  role: string;
}
