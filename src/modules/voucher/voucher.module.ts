import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LedgerModule } from '../../modules/ledger/ledger.module';
import { PackageModule } from '../../modules/package/package.module';
import { QrcodeModule } from '../../modules/qrcode/qrcode.module';
import { RedisCacheModule } from '../../modules/redis-cache/redis-cache.module';
import { WebsocketModule } from '../../modules/websocket/websocket.module';
import { VoucherController } from './voucher.controller';
import { VoucherRepository } from './voucher.repository';
import { VoucherService } from './voucher.service';
import { VoucherClaimRepository } from './voucher-claim.repository';
import { VoucherRequestController } from './voucher-request.controller';
import { VoucherRequestRepository } from './voucher-request.repository';
import { VoucherRequestService } from './voucher-request.service';

@Module({
  imports: [
    forwardRef(() => PackageModule),
    forwardRef(() => LedgerModule),
    forwardRef(() => QrcodeModule),
    forwardRef(() => RedisCacheModule),
    forwardRef(() => WebsocketModule),
    TypeOrmModule.forFeature([VoucherRequestRepository]),
    TypeOrmModule.forFeature([VoucherRepository]),
    TypeOrmModule.forFeature([VoucherClaimRepository]),
  ],
  controllers: [VoucherRequestController, VoucherController],
  providers: [VoucherRequestService, VoucherService],
  exports: [VoucherRequestService, TypeOrmModule, VoucherService],
})
export class VoucherModule {}
