import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { CitizenPageOptionsDto } from 'modules/user/dto/citizen-page-options.dto';
import type { FindConditions } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import type { Optional } from 'types';

import type { PageDto } from '../../common/dto/page.dto';
import { FileNotImageException } from '../../exceptions/file-not-image.exception';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { IFile } from '../../interfaces';
import { UtilsProvider } from '../../providers/utils.provider';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { CitizenEntity } from './citizen.entity';
import { CitizenRepository } from './citizen.repository';
import type { CitizenDto } from './dto/citizen-dto';
import type { CitizenLoginDto } from './dto/citizen-login-dto';
import { CitizenRegisterDto } from './dto/citizen-register-dto';

@Injectable()
export class CitizenService {
  constructor(
    public readonly citizenRepository: CitizenRepository,
    public readonly validatorService: ValidatorService,
    public readonly awsS3Service: AwsS3Service,
  ) {}

  /**
   * Find single user
   */
  findOne(
    findData: FindConditions<CitizenEntity>,
  ): Promise<Optional<CitizenEntity>> {
    return this.citizenRepository.findOne(findData);
  }

  @Transactional()
  async createCitizen(
    citizenRegisterDto: CitizenRegisterDto,
    file: IFile,
  ): Promise<CitizenEntity> {
    const citizen = this.citizenRepository.create(citizenRegisterDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      citizen.avatar = await this.awsS3Service.uploadImage(file);
    }

    return this.citizenRepository.save(citizen);
  }

  async validateLogin(loginDto: CitizenLoginDto): Promise<CitizenEntity> {
    const citizen = await this.citizenRepository.findOne({
      email: loginDto.email,
    });

    const isPasswordValid = await UtilsProvider.validateHash(
      loginDto.password,
      citizen?.password,
    );

    if (!citizen || !isPasswordValid) {
      throw new UnauthorizedException();
    }

    if (!citizen.IsValid) {
      throw new HttpException(
        'Your account is under verifying',
        HttpStatus.FORBIDDEN,
      );
    }

    return citizen;
  }

  async getCitizens(
    pageOptionsDto: CitizenPageOptionsDto,
  ): Promise<PageDto<CitizenDto>> {
    const queryBuilder = this.citizenRepository
      .createQueryBuilder('citizen')
      .orderBy('citizen.created_at', pageOptionsDto.order);

    if (pageOptionsDto.is_valid) {
      queryBuilder.andWhere('is_valid = :IsValid', {
        IsValid: pageOptionsDto.is_valid,
      });
    }

    if (pageOptionsDto.is_active) {
      queryBuilder.andWhere('is_active = :is_active', {
        is_active: pageOptionsDto.is_active,
      });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async validateCitizen(id: string, isValid: boolean): Promise<CitizenDto> {
    const citizen = await this.citizenRepository.findOne(id);

    if (!citizen) {
      throw new UserNotFoundException();
    }

    citizen.IsValid = isValid;

    return this.citizenRepository.save(citizen);
  }

  async deleteCitizen(id: string): Promise<void> {
    const citizen = await this.citizenRepository.findOne(id);

    if (!citizen || citizen.IsValid) {
      throw new UserNotFoundException();
    }

    await this.citizenRepository.delete({ id: citizen.id });
  }
}
