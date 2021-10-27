import { forwardRef, Module } from '@nestjs/common';

import { VoucherModule } from '../voucher/voucher.module';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  imports: [forwardRef(() => VoucherModule)],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
