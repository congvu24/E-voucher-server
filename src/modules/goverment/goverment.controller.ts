import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { PageDto } from '../../common/dto/page.dto';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { CitizenService } from '../../modules/citizen/citizen.service';
import { CitizenDto } from '../../modules/citizen/dto/citizen-dto';
import { UsersPageOptionsDto } from '../../modules/user/dto/users-page-options.dto';
import { GovermentService } from './goverment.service';

@Controller('goverment')
@ApiTags('goverment')
export class GovermentController {
  constructor(
    private readonly govermentService: GovermentService,
    private readonly citizenService: CitizenService,
  ) {}

  @Get('/citizen')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.GOVERMENT])
  @ApiOkResponse({
    type: PageDto,
    description: 'List of citizen',
  })
  async getListCitizen(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<CitizenDto>> {
    return this.citizenService.getCitizens(pageOptionsDto);
  }

  @Put('/citizen/:id')
  @Auth([RoleType.GOVERMENT])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Active citizen successfull',
    type: CitizenDto,
  })
  validCitizen(
    @UUIDParam('id') userId: string,
    @Query('isValid', ParseBoolPipe) isValid: boolean,
  ): Promise<CitizenDto> {
    return this.citizenService.validateCitizen(userId, isValid);
  }

  @Delete('/citizen/:id')
  @Auth([RoleType.GOVERMENT])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Reject citizen registration',
    type: CitizenDto,
  })
  rejectCitizen(@UUIDParam('id') userId: string): Promise<void> {
    return this.citizenService.deleteCitizen(userId);
  }
}
