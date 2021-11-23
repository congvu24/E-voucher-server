import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { VoucherClaimEntity } from './voucher-claim.entity';

@EntityRepository(VoucherClaimEntity)
export class VoucherClaimRepository extends Repository<VoucherClaimEntity> {}
