import { Test, TestingModule } from '@nestjs/testing';
import { PriceTypeService } from './price_type.service';

describe('PriceTypeService', () => {
  let service: PriceTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceTypeService],
    }).compile();

    service = module.get<PriceTypeService>(PriceTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
