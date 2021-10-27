import { Test, TestingModule } from '@nestjs/testing';
import { VoucherRequestService } from './voucher-request.service';

describe('VoucherRequestService', () => {
  let service: VoucherRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoucherRequestService],
    }).compile();

    service = module.get<VoucherRequestService>(VoucherRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
