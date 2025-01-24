import { Test, TestingModule } from '@nestjs/testing';
import { RequestCustomerService } from './request_customer.service';

describe('RequestCustomerService', () => {
  let service: RequestCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestCustomerService],
    }).compile();

    service = module.get<RequestCustomerService>(RequestCustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
