import { Test, TestingModule } from '@nestjs/testing';
import { PriceTypeController } from './price_type.controller';

describe('PriceTypeController', () => {
  let controller: PriceTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceTypeController],
    }).compile();

    controller = module.get<PriceTypeController>(PriceTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
