import { Test, TestingModule } from '@nestjs/testing';
import { CustomerCategoryService } from './customer_category.service';

describe('CustomerCategoryService', () => {
  let service: CustomerCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerCategoryService],
    }).compile();

    service = module.get<CustomerCategoryService>(CustomerCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
