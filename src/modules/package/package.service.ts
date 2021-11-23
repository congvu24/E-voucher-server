import { Injectable, NotFoundException } from '@nestjs/common';
import type { PageDto } from 'common/dto/page.dto';
import type { PageOptionsDto } from 'common/dto/page-options.dto';
import type { IFile } from 'interfaces/IFile';
import type { FindConditions } from 'typeorm';
import type { Optional } from 'types';

import type { UserEntity } from '../../modules/user/user.entity';
import type { PackageCreateDto } from './dto/create-package-dto';
import type { PackageDto } from './dto/package-dto';
import type { PackageEntity } from './package.entity';
import { PackageRepository } from './package.repository';

@Injectable()
export class PackageService {
  constructor(private packageRepository: PackageRepository) {}

  /**
   * Find single request
   */
  findOne(
    findData: FindConditions<PackageEntity>,
  ): Promise<Optional<PackageEntity>> {
    return this.packageRepository.findOne(findData, {
      relations: ['dealer'],
    });
  }

  async createPackage(
    dealer: UserEntity,
    data: PackageCreateDto,
    file?: IFile,
  ): Promise<PackageDto> {
    const newPackage = this.packageRepository.create(data);
    newPackage.dealer = dealer;

    if (file) {
      console.log(file);
    }

    await this.packageRepository.save(newPackage);

    return newPackage.toDto();
  }

  async getPackage(
    dealer: UserEntity,
    pageOptions: PageOptionsDto,
  ): Promise<PageDto<PackageDto>> {
    const queryBuilder = this.packageRepository
      .createQueryBuilder('package')
      .where('package.dealer_id = :id', { id: dealer.id })
      .orderBy('package.created_at', pageOptions.order);

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptions);

    return items.toPageDto(pageMetaDto);
  }

  async deletePackage(dealer: UserEntity, id: string): Promise<void> {
    const servicePackage = await this.packageRepository.findOne(id, {
      relations: ['dealer'],
    });

    if (!servicePackage || servicePackage.dealer.id !== dealer.id) {
      throw new NotFoundException();
    }

    await this.packageRepository.softDelete({ id: servicePackage.id });
  }

  async editPackage(
    dealer: UserEntity,
    id: string,
    data: PackageCreateDto,
  ): Promise<PackageEntity | undefined> {
    const servicePackage = await this.packageRepository.findOne(id, {
      relations: ['dealer'],
    });

    if (!servicePackage || servicePackage.dealer.id !== dealer.id) {
      throw new NotFoundException();
    }

    await this.packageRepository.update({ id: servicePackage.id }, { ...data });

    return this.packageRepository.findOne(id);
  }
}
