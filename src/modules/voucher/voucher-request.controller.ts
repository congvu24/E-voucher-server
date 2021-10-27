import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { PageDto } from '../../common/dto/page.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { CitizenEntity } from '../citizen/citizen.entity';
import { VoucherRequestPageOptions } from './Dto/request-page-options.dto';
import { VoucherRequestCreateDto } from './Dto/voucher-request-create-dto';
import { VoucherRequestDto } from './Dto/voucher-request-dto';
import { VoucherRequestService } from './voucher-request.service';

@Controller('voucher-request')
@ApiTags('voucher')
export class VoucherRequestController {
  constructor(private readonly voucherRequestService: VoucherRequestService) {}

  @Post('/request')
  @Auth([RoleType.USER])
  @ApiOkResponse({
    type: VoucherRequestDto,
    description: 'Create request success',
  })
  async createRequest(
    @AuthUser() user: CitizenEntity,
    @Body() data: VoucherRequestCreateDto,
  ): Promise<VoucherRequestDto> {
    return this.voucherRequestService.createRequest(user, data);
  }

  @Get()
  @Auth([RoleType.USER])
  @ApiOkResponse({
    type: PageDto,
    description: 'List of request',
  })
  async getListRequest(
    @AuthUser() user: CitizenEntity,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: VoucherRequestPageOptions,
  ): Promise<PageDto<VoucherRequestDto>> {
    return this.voucherRequestService.getVoucherRequest(user, pageOptionsDto);
  }

  @Delete(':id')
  @Auth([RoleType.USER])
  @ApiOkResponse({
    type: PageDto,
    description: 'Delete request',
  })
  async deleteRequest(
    @AuthUser() user: CitizenEntity,
    @UUIDParam('id') id: string,
  ): Promise<void> {
    return this.voucherRequestService.deleteRequest(user, id);
  }
}
