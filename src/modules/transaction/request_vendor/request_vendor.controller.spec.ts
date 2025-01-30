import { Test, TestingModule } from '@nestjs/testing';
import { RequestVendorController } from './request_vendor.controller';

describe('RequestVendorController', () => {
  let controller: RequestVendorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestVendorController],
    }).compile();

    controller = module.get<RequestVendorController>(RequestVendorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
