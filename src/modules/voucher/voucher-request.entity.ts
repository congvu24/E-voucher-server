import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { VoucherRequestType } from '../../common/constants/voucher-request-type';
import { UseDto } from '../../decorators/use-dto.decorator';
import { CitizenEntity } from '../citizen/citizen.entity';
import type { VoucherRequestDtoOptions } from './Dto/voucher-request-dto';
import { VoucherRequestDto } from './Dto/voucher-request-dto';
import { VoucherEntity } from './voucher.entity';

@Entity({ name: 'request' })
@UseDto(VoucherRequestDto)
export class VoucherRequestEntity extends AbstractEntity<
  VoucherRequestDto,
  VoucherRequestDtoOptions
> {
  @ManyToOne(() => CitizenEntity, (citizen) => citizen.requests)
  citizen: CitizenEntity;

  @Column({
    type: 'enum',
    enum: VoucherRequestType,
    default: VoucherRequestType.PENDING,
  })
  status: VoucherRequestType;

  @Column({ nullable: true })
  note: string;

  @OneToOne(() => VoucherEntity)
  @JoinColumn()
  voucher: VoucherEntity;
}
