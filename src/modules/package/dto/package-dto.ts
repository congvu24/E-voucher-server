import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserDto } from '../../../modules/user/dto/user-dto';
import type { PackageEntity } from '../package.entity';

export type PackageDtoOptions = Partial<{
  isShow: boolean;
}>;

export class PackageDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  isShow: boolean;

  @ApiPropertyOptional()
  dealer: UserDto;

  constructor(item: PackageEntity, options?: PackageDtoOptions) {
    super(item);
    this.name = item.name;
    this.description = item.description;
    this.dealer = item.dealer?.toDto();
  }
}
