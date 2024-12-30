import { Test, TestingModule } from '@nestjs/testing';
import { SummaryTestCfitService } from './summary_test_cfit.service';

describe('SummaryTestCfitService', () => {
  let service: SummaryTestCfitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummaryTestCfitService],
    }).compile();

    service = module.get<SummaryTestCfitService>(SummaryTestCfitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
