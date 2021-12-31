import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as csv from 'fast-csv';

import { RoleType } from '../../common/constants/role-type';
import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { ApiFile } from '../../decorators/swagger.schema';
import { FileNotImageException } from '../../exceptions/file-not-image.exception';
import { IFile } from '../../interfaces/IFile';
import { UserEntity } from '../../modules/user/user.entity';
import { PackageCreateDto } from './dto/create-package-dto';
import { PackageDto } from './dto/package-dto';
import { PackagePageOptions } from './dto/package-page-options.dto';
import { PackageService } from './package.service';

@Controller('package')
@ApiTags('service package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.DEALER])
  @ApiOkResponse({
    type: PackageDto,
    description: 'create service package success',
  })
  @ApiFile({ name: 'thumbnail' })
  async createPackage(
    @AuthUser() dealer: UserEntity,
    @Body() data: PackageCreateDto,
    @UploadedFile() file: IFile,
  ): Promise<PackageDto> {
    const listAccept = ['image/jpeg', 'image/jpg', 'image/png'];

    if (file && !listAccept.includes(file.mimetype)) {
      throw new FileNotImageException();
    }

    return this.packageService.createPackage(dealer, data, file);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.DEALER])
  @ApiOkResponse({
    type: PageDto,
    description: 'List of your package',
  })
  async getPackage(
    @AuthUser() dealer: UserEntity,
    @Query(new ValidationPipe({ transform: true }))
    pageOptions: PackagePageOptions,
  ): Promise<PageDto<PackageDto>> {
    return this.packageService.getPackage(dealer, pageOptions);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.DEALER])
  @ApiOkResponse({
    type: PageDto,
    description: 'List of your package',
  })
  async deletePackage(
    @AuthUser() dealer: UserEntity,
    @UUIDParam('id')
    id: string,
  ): Promise<void> {
    return this.packageService.deletePackage(dealer, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.DEALER])
  @ApiOkResponse({
    type: PackageDto,
    description: 'edit your package',
  })
  async editPackage(
    @AuthUser() dealer: UserEntity,
    @UUIDParam('id')
    id: string,
    @Body() data: PackageCreateDto,
  ): Promise<PackageDto | undefined> {
    return this.packageService.editPackage(dealer, id, data);
  }

  @Get('export')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.DEALER])
  @ApiOkResponse({
    type: PageDto,
    description: 'List of voucher',
  })
  async exportListCitizen(
    @AuthUser() dealer: UserEntity,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
    @Res() res: Response,
  ): Promise<void> {
    const listCitizen = await this.packageService.getPackage(
      dealer,
      pageOptionsDto,
    );

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
