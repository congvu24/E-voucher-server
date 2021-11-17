import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LedgerModule } from '../../modules/ledger/ledger.module';
import { PackageModule } from '../../modules/package/package.module';
import { QrcodeModule } from '../../modules/qrcode/qrcode.module';
import { RedisCacheModule } from '../../modules/redis-cache/redis-cache.module';
import { VoucherController } from './voucher.controller';
import { VoucherRepository } from './voucher.repository';
import { VoucherService } from './voucher.service';
import { VoucherRequestController } from './voucher-request.controller';
import { VoucherRequestRepository } from './voucher-request.repository';
import { VoucherRequestService } from './voucher-request.service';

@Module({
  imports: [
    forwardRef(() => PackageModule),
    forwardRef(() => LedgerModule),
    forwardRef(() => QrcodeModule),
    forwardRef(() => RedisCacheModule),
    TypeOrmModule.forFeature([VoucherRequestRepository]),
    TypeOrmModule.forFeature([VoucherRepository]),
  ],
  controllers: [VoucherRequestController, VoucherController],
  providers: [VoucherRequestService, VoucherService],
  exports: [VoucherRequestService, TypeOrmModule],
})
export class VoucherModule {}