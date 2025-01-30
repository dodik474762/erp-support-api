import { Test, TestingModule } from '@nestjs/testing';
import { RequestVendorService } from './request_vendor.service';

describe('RequestVendorService', () => {
  let service: RequestVendorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestVendorService],
    }).compile();

    service = module.get<RequestVendorService>(RequestVendorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
