import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { VoucherStatusType } from '../../common/constants/voucher-status-type';
import { UseDto } from '../../decorators/use-dto.decorator';
import { PackageEntity } from '../../modules/package/package.entity';
import { UserEntity } from '../../modules/user/user.entity';
import { CitizenEntity } from '../citizen/citizen.entity';
import type { VoucherDtoOptions } from './Dto/voucher-dto';
import { VoucherDto } from './Dto/voucher-dto';
import { VoucherRequestEntity } from './voucher-request.entity';

@Entity({ name: 'voucher' })
@UseDto(VoucherDto)
export class VoucherEntity extends AbstractEntity<
  VoucherDto,
  VoucherDtoOptions
> {
  @Column({
    type: 'enum',
    enum: VoucherStatusType,
    default: VoucherStatusType.UNUSE,
  })
  status: VoucherStatusType;

  @Column({ nullable: true })
  value: number;

  @ManyToOne(() => CitizenEntity, (citizen) => citizen.vouchers)
  citizen: CitizenEntity;

  @ManyToOne(() => UserEntity, (supplier) => supplier.vouchersCreated)
  supplier: UserEntity;

  @ManyToOne(() => UserEntity, (supplier) => supplier.vouchersRedeemed)
  dealer: UserEntity;

  @ManyToOne(() => PackageEntity)
  package: PackageEntity;
}
