import { forwardRef, Module } from '@nestjs/common';
import { CitizenModule } from '../citizen/citizen.module';
import { CitizenService } from '../citizen/citizen.service';
import { GovermentController } from './goverment.controller';
import { GovermentService } from './goverment.service';

@Module({
  imports: [forwardRef(() => CitizenModule)],
  controllers: [GovermentController],
  providers: [GovermentService],
})
export class GovermentModule {}
