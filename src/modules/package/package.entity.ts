import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators/use-dto.decorator';
import { UserEntity } from '../../modules/user/user.entity';
import type { PackageDtoOptions } from './dto/package-dto';
import { PackageDto } from './dto/package-dto';

@Entity({ name: 'package' })
@UseDto(PackageDto)
export class PackageEntity extends AbstractEntity<
  PackageDto,
  PackageDtoOptions
> {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  minValue: number;

  @Column({ nullable: true })
  maxValue: number;

  @Column({ nullable: false, default: true })
  isShow: boolean;

  @ManyToOne(() => UserEntity, (request) => request.packages)
  dealer: UserEntity;
}
