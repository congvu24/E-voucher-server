import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CitizenController } from './citizen.controller';
import { CitizenRepository } from './citizen.repository';
import { CitizenService } from './citizen.service';

@Module({
  imports: [TypeOrmModule.forFeature([CitizenRepository])],
  controllers: [CitizenController],
  providers: [CitizenService],
  exports: [CitizenService],
})
export class CitizenModule {}
