import { Test, TestingModule } from '@nestjs/testing';
import { CostCategoryService } from './cost_category.service';

describe('CostCategoryService', () => {
  let service: CostCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostCategoryService],
    }).compile();

    service = module.get<CostCategoryService>(CostCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
