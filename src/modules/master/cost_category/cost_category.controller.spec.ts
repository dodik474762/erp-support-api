import { Test, TestingModule } from '@nestjs/testing';
import { CostCategoryController } from './cost_category.controller';

describe('CostCategoryController', () => {
  let controller: CostCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostCategoryController],
    }).compile();

    controller = module.get<CostCategoryController>(CostCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
