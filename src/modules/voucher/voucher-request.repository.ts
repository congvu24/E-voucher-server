import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { VoucherRequestEntity } from './voucher-request.entity';

@EntityRepository(VoucherRequestEntity)
export class VoucherRequestRepository extends Repository<VoucherRequestEntity> {}
