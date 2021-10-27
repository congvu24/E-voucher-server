import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { CitizenEntity } from '../citizen.entity';

export type CitizenDtoOptions = Partial<{
  isActive: boolean;
  isValid: boolean;
}>;

export class CitizenDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  identify: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  dob?: Date;

  @ApiPropertyOptional()
  address: string;

  @ApiPropertyOptional()
  job: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  isValid?: boolean;

  @ApiPropertyOptional()
  role: string;

  constructor(user: CitizenEntity, options?: CitizenDtoOptions) {
    super(user);
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.isActive = user.isActive;
    this.isValid = user.IsValid;
    this.job = user.job;
    this.identify = user.identify;
    this.address = user.address;
    this.dob = user.dob;
    this.role = user.role;
  }
}
