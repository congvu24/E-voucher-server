import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { PackageEntity } from './package.entity';

@EntityRepository(PackageEntity)
export class PackageRepository extends Repository<PackageEntity> {}
