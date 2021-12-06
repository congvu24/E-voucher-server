import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../../modules/user/user.entity';
import { AnalyticsService } from './analytics.service';
import type IAgencyAnalytic from './dto/agencyAnalytics';
import type IDealerAnalytic from './dto/dealerAnalytics.dto';
import type ISupplierAnalytic from './dto/supplierAnalytics.dto';

@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {
  constructor(public readonly analyticService: AnalyticsService) {}

  @Get('/supplier')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Analytic',
  })
  async getSupplierAnalytics(): Promise<ISupplierAnalytic> {
    return this.analyticService.getSupplierAnalytics();
  }

  @Get('/dealer')
  @Auth([RoleType.DEALER])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Analytic',
  })
  async getDealerAnalytics(
    @AuthUser() user: UserEntity,
  ): Promise<IDealerAnalytic> {
    return this.analyticService.getDealerAnalytics(user.id);
  }

  @Get('/agency')
  @Auth([RoleType.GOVERMENT])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Analytic',
  })
  async getAgencyAnalytic(): Promise<IAgencyAnalytic> {
    return this.analyticService.getAgencyAnalytics();
  }
}
