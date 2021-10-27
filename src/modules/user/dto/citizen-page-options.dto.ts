import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class CitizenPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  is_active: boolean;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  is_valid: boolean;
}
