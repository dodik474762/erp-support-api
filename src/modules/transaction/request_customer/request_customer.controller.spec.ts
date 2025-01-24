import { Test, TestingModule } from '@nestjs/testing';
import { RequestCustomerController } from './request_customer.controller';

describe('RequestCustomerController', () => {
  let controller: RequestCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestCustomerController],
    }).compile();

    controller = module.get<RequestCustomerController>(RequestCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
