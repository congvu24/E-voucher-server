import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CitizenEditDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  IsValid: boolean;
}
