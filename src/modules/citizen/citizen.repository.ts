import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CitizenEntity } from './citizen.entity';

@EntityRepository(CitizenEntity)
export class CitizenRepository extends Repository<CitizenEntity> {}
