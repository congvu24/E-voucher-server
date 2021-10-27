import { Test, TestingModule } from '@nestjs/testing';
import { VoucherRequestController } from './voucher-request.controller';

describe('VoucherRequestController', () => {
  let controller: VoucherRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherRequestController],
    }).compile();

    controller = module.get<VoucherRequestController>(VoucherRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
