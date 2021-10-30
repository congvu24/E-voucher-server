import { bool } from 'aws-sdk/clients/signer';
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
import { UseDto } from '../../decorators/use-dto.decorator';
import { VoucherEntity } from '../../modules/voucher/voucher.entity';
import { VoucherRequestEntity } from '../voucher/voucher-request.entity';
import type { CitizenDtoOptions } from './dto/citizen-dto';
import { CitizenDto } from './dto/citizen-dto';

@Entity({ name: 'citizens' })
@UseDto(CitizenDto)
export class CitizenEntity extends AbstractEntity<
  CitizenDto,
  CitizenDtoOptions
> {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  identify: string;

  @Column({ nullable: false })
  dob: Date;

  @Column({ nullable: false })
  address: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  job: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: false, default: false })
  isActive: bool;

  @Column({ nullable: false, default: false })
  IsValid: bool;

  @Column({ nullable: false, default: RoleType.USER })
  role: RoleType.USER;

  @Column({ nullable: true })
  secret: string;

  @OneToMany(() => VoucherRequestEntity, (request) => request.citizen)
  requests: VoucherRequestEntity[];

  @OneToMany(() => VoucherEntity, (voucher) => voucher.citizen)
  vouchers: VoucherEntity[];
}
