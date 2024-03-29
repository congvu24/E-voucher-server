import { forwardRef, Module } from '@nestjs/common';

import { CitizenModule } from '../../modules/citizen/citizen.module';
import { PackageModule } from '../../modules/package/package.module';
import { UserModule } from '../../modules/user/user.module';
import { VoucherModule } from '../../modules/voucher/voucher.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => VoucherModule),
    forwardRef(() => CitizenModule),
    forwardRef(() => PackageModule),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
