import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import type { VoucherRequestDto } from 'modules/voucher/Dto/voucher-request-dto';

import { RoleType } from '../../common/constants/role-type';
import { PageDto } from '../../common/dto/page.dto';
import { Auth } from '../../decorators/http.decorators';
import { VoucherRequestPageOptionsForManager } from '../../modules/voucher/Dto/request-page-options.dto';
import { SupplierService } from './supplier.service';

@Controller('supplier')
@ApiTags('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get('/request')
  @Auth([RoleType.SUPPLIER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: PageDto,
  })
  async getRequest(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: VoucherRequestPageOptionsForManager,
  ): Promise<PageDto<VoucherRequestDto>> {
    return this.supplierService.getVoucherRequest(pageOptionsDto);
  }
}
