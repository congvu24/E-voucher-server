import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ApiFile } from '../../decorators/swagger.schema';
import { IFile } from '../../interfaces';
import { CitizenService } from './citizen.service';
import { CitizenDto } from './dto/citizen-dto';
import { CitizenLoginDto } from './dto/citizen-login-dto';
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CitizenDto, description: 'Login success' })
  async citizenLogin(
    @Body() citizenLoginDto: CitizenLoginDto,
  ): Promise<CitizenDto> {
    const citizen = await this.citizenService.validateLogin(citizenLoginDto);

    return citizen.toDto();
  }
}
