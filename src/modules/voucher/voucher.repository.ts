import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { VoucherEntity } from './voucher.entity';

@EntityRepository(VoucherEntity)
export class VoucherRepository extends Repository<VoucherEntity> {}
