import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CitizenDto } from '../../../modules/citizen/dto/citizen-dto';
import { PackageDto } from '../../../modules/package/dto/package-dto';
import type { VoucherClaimEntity } from '../voucher-claim.entity';
import { VoucherDto } from './voucher-dto';

// eslint-disable-next-line @typescript-eslint/ban-types
export type VoucherClaimDtoOptions = Partial<{}>;

export class VoucherClaimDto extends AbstractDto {
  @ApiPropertyOptional()
  voucherId: string;

  @ApiPropertyOptional()
  value: number;

  @ApiPropertyOptional()
  citizenName: string;

  @ApiPropertyOptional()
  citizenEmail: string;

  @ApiPropertyOptional()
  servicePackage: PackageDto;

  @ApiPropertyOptional()
  citizen: CitizenDto;

  @ApiPropertyOptional()
  voucher: VoucherDto;

  constructor(claim: VoucherClaimEntity) {
    super(claim);
    this.id = claim.id;
    this.voucherId = claim.id;
    this.citizenName = claim.citizenName;
    this.citizenEmail = claim.citizenEmail;
    this.value = claim.value;
    this.servicePackage = claim.servicePackage?.toDto();
    this.citizen = claim['citizen']?.toDto();
    this.voucher = claim['voucher']?.toDto();
  }
}
