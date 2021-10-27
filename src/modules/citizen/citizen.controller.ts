import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { PageDto } from '../../common/dto/page.dto';
import { Auth } from '../../decorators/http.decorators';
import { ApiFile } from '../../decorators/swagger.schema';
import { IFile } from '../../interfaces';
import { CitizenPageOptionsDto } from '../../modules/user/dto/citizen-page-options.dto';
import { CitizenService } from './citizen.service';
import type { CitizenDto } from './dto/citizen-dto';
import { CitizenRegisterDto } from './dto/citizen-register-dto';

@Controller('citizen')
@ApiTags('citizen')
export class CitizenController {
  constructor(public readonly citizenService: CitizenService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Register successfull' })
  @ApiFile({ name: 'avatar' })
  async citizenRegister(
    @Body() citizenRegisterDto: CitizenRegisterDto,
    @UploadedFile() file: IFile,
  ): Promise<CitizenDto> {
    if (
      new Date().getFullYear() -
        new Date(citizenRegisterDto.dob).getFullYear() <
      18
    ) {
      throw new HttpException(
        'You must be at least 18 years old',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdCitizen = await this.citizenService.createCitizen(
      citizenRegisterDto,
      file,
    );

    return createdCitizen.toDto();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.GOVERMENT, RoleType.SUPPLIER])
  @ApiOkResponse({
    type: PageDto,
    description: 'List of citizen',
  })
  async getListCitizen(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: CitizenPageOptionsDto,
  ): Promise<PageDto<CitizenDto>> {
    return this.citizenService.getCitizens(pageOptionsDto);
  }
}
