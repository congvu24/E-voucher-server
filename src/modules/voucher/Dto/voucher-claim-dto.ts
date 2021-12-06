import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PackageDto } from '../../../modules/package/dto/package-dto';
import type { VoucherClaimEntity } from '../voucher-claim.entity';

// eslint-disable-next-line @typescript-eslint/ban-types
export type VoucherClaimDtoOptions = Partial<{}>;

export class VoucherClaimDto extends AbstractDto {
  @ApiPropertyOptional()
  voucherId: string;

  @ApiPropertyOptional()
  value: number;

  @ApiPropertyOptional()
  servicePackage: PackageDto;

  constructor(claim: VoucherClaimEntity) {
    super(claim);
    this.id = claim.id;
    this.voucherId = claim.id;
    this.value = claim.value;
    this.servicePackage = claim.servicePackage.toDto();
  }
}
