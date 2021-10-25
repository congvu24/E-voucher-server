import { Test, TestingModule } from '@nestjs/testing';
import { GovermentController } from './goverment.controller';

describe('GovermentController', () => {
  let controller: GovermentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GovermentController],
    }).compile();

    controller = module.get<GovermentController>(GovermentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
