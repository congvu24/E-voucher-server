import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PackageModule } from '../../modules/package/package.module';
import { VoucherController } from './voucher.controller';
import { VoucherRepository } from './voucher.repository';
import { VoucherService } from './voucher.service';
import { VoucherRequestController } from './voucher-request.controller';
import { VoucherRequestRepository } from './voucher-request.repository';
import { VoucherRequestService } from './voucher-request.service';

@Module({
  imports: [
    forwardRef(() => PackageModule),
    TypeOrmModule.forFeature([VoucherRequestRepository]),
    TypeOrmModule.forFeature([VoucherRepository]),
  ],
  controllers: [VoucherRequestController, VoucherController],
  providers: [VoucherRequestService, VoucherService],
  exports: [VoucherRequestService, TypeOrmModule],
})
export class VoucherModule {}
