import { bool } from 'aws-sdk/clients/signer';
import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators/use-dto.decorator';
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
}
