import { Test, TestingModule } from '@nestjs/testing';
import { VendorCategoryService } from './vendor_category.service';

describe('VendorCategoryService', () => {
  let service: VendorCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorCategoryService],
    }).compile();

    service = module.get<VendorCategoryService>(VendorCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
