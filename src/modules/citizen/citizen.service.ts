import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
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
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CitizenDto>> {
    const queryBuilder = this.citizenRepository
      .createQueryBuilder('citizen')
      .where('is_valid = :IsValid', { IsValid: false });

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
