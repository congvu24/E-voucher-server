import { Test, TestingModule } from '@nestjs/testing';
import { GovermentService } from './goverment.service';

describe('GovermentService', () => {
  let service: GovermentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GovermentService],
    }).compile();

    service = module.get<GovermentService>(GovermentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
