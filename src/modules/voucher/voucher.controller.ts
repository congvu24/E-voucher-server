import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { PageDto } from '../../common/dto/page.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { CitizenEntity } from '../citizen/citizen.entity';
import { ClaimVoucherDto } from './Dto/claim-voucher-dto';
import {
  VoucherBulkCreateDto,
  VoucherCreateDto,
} from './Dto/voucher-create-dto';
import { VoucherDto } from './Dto/voucher-dto';
import { VoucherPageOptions } from './Dto/voucher-page-options.dto';
import { VoucherQR } from './Dto/voucher-qr-dto';
import { VoucherService } from './voucher.service';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('/create/bulk')
  @ApiTags('supplier')
  @Auth([RoleType.SUPPLIER])
  @ApiOkResponse({
    description: 'Create many voucher',
  })
  async createBulkVoucher(
    @Body() data: VoucherBulkCreateDto,
  ): Promise<VoucherDto[]> {
    return this.voucherService.createBulkVoucher(data);
  }

  @Post('/create')
  @ApiTags('supplier')
  @Auth([RoleType.SUPPLIER])
  @ApiOkResponse({
    type: VoucherDto,
    description: 'Create a voucher',
  })
  async createRequest(@Body() data: VoucherCreateDto): Promise<VoucherDto> {
    return this.voucherService.createVoucher(data);
  }

  @Get('/my')
  @ApiTags('voucher')
  @Auth([RoleType.USER])
  @ApiOkResponse({
    type: PageDto,
    description: 'Get my voucher',
  })
  getMyVoucher(
    @AuthUser() user: CitizenEntity,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: VoucherPageOptions,
  ): Promise<PageDto<VoucherDto>> {
    return this.voucherService.getMyVoucher(user, pageOptionsDto);
  }

  @Get('')
  @ApiTags('supplier')
  @Auth([RoleType.SUPPLIER])
  @ApiOkResponse({
    type: PageDto,
    description: 'Get list voucher',
  })
  getAllVoucher(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: VoucherPageOptions,
  ): Promise<PageDto<VoucherDto>> {
    return this.voucherService.getAllVoucher(pageOptionsDto);
  }

  @Put('/cancel/:id')
  @ApiTags('voucher')
  @Auth([RoleType.USER])
  @ApiOkResponse({
    type: VoucherDto,
    description: 'Cancel my voucher',
  })
  cancelVoucher(
    @AuthUser() user: CitizenEntity,
    @Query('id')
    id: string,
  ): Promise<VoucherDto> {
    return this.voucherService.cancelVoucher(user, id);
  }

  @Delete('')
  @ApiTags('supplier')
  @Auth([RoleType.SUPPLIER])
  @ApiOkResponse({
    type: VoucherDto,
    description: 'Delete a voucher',
  })
  deleteVoucher(
    @Query('id')
    id: string,
  ): Promise<VoucherDto> {
    return this.voucherService.deleteVoucher(id);
  }

  @Put('/qr/:id')
  @ApiTags('voucher')
  @Auth([RoleType.USER])
  @ApiOkResponse({
    type: VoucherQR,
    description: 'Get voucher qr code',
  })
  getVoucherQR(@UUIDParam('id') voucherId: string): Promise<VoucherQR> {
    return this.voucherService.getVoucherQR(voucherId);
  }

  @Put('/claim')
  @ApiTags('dealer')
  @Auth([RoleType.DEALER])
  @ApiOkResponse({
    type: VoucherDto,
    description: 'Claim a voucher',
  })
  claimVoucher(
    @Query(new ValidationPipe({ transform: true }))
    data: ClaimVoucherDto,
  ): Promise<VoucherDto> {
    return this.voucherService.claimVoucher(data);
  }
}
