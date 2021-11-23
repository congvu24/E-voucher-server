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
  servicePackage: PackageDto;

  constructor(voucher: VoucherClaimEntity) {
    super(voucher);
    this.id = voucher.id;
    this.voucherId = voucher.id;
    this.servicePackage = voucher.servicePackage.toDto();
  }
}
