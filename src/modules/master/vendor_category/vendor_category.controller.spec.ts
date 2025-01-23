import { Test, TestingModule } from '@nestjs/testing';
import { VendorCategoryController } from './vendor_category.controller';

describe('VendorCategoryController', () => {
  let controller: VendorCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorCategoryController],
    }).compile();

    controller = module.get<VendorCategoryController>(VendorCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
