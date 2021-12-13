import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as csv from 'fast-csv';
import { pipeline } from 'stream/promises';

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

  @Get('export')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.GOVERMENT, RoleType.SUPPLIER])
  @ApiOkResponse({
    type: PageDto,
    description: 'List of citizen',
  })
  async exportListCitizen(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: CitizenPageOptionsDto,
    @Res() res: Response,
  ): Promise<void> {
    const listCitizen = await this.citizenService.getCitizens(pageOptionsDto);

    res.setHeader('Content-Type', 'application/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=export.csv');

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    for (const item of listCitizen.data) {
      csvStream.write({ ...item });
    }

    csvStream.end();
  }
}
