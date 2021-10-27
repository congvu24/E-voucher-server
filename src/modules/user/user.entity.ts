import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
import { UseDto } from '../../decorators/use-dto.decorator';
import { PackageEntity } from '../../modules/package/package.entity';
import { VoucherEntity } from '../../modules/voucher/voucher.entity';
import type { UserDtoOptions } from './dto/user-dto';
import { UserDto } from './dto/user-dto';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true })
  avatar?: string;

  @OneToMany(() => PackageEntity, (servicePackage) => servicePackage.dealer)
  packages: PackageEntity[];

  @OneToMany(() => VoucherEntity, (voucher) => voucher.supplier)
  vouchersCreated: VoucherEntity[];

  @OneToMany(() => VoucherEntity, (voucher) => voucher.dealer)
  vouchersRedeemed: VoucherEntity[];
}
