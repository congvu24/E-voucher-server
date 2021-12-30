import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators/use-dto.decorator';
import { PackageEntity } from '../../modules/package/package.entity';
import type { VoucherClaimDtoOptions } from './Dto/voucher-claim-dto';
import { VoucherClaimDto } from './Dto/voucher-claim-dto';

@Entity({ name: 'voucherClaim' })
@UseDto(VoucherClaimDto)
export class VoucherClaimEntity extends AbstractEntity<
  VoucherClaimDto,
  VoucherClaimDtoOptions
> {
  @Column({ unique: true })
  voucherId: string;

  @Column({ default: 0 })
  value: number;

  @Column({ nullable: true })
  citizenName: string;

  @Column({ nullable: true })
  citizenEmail: string;

  @ManyToOne(() => PackageEntity, (servicePackage) => servicePackage.claims)
  servicePackage: PackageEntity;
}
