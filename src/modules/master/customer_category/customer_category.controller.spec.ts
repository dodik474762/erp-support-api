import { Test, TestingModule } from '@nestjs/testing';
import { CustomerCategoryController } from './customer_category.controller';

describe('CustomerCategoryController', () => {
  let controller: CustomerCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerCategoryController],
    }).compile();

    controller = module.get<CustomerCategoryController>(CustomerCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
