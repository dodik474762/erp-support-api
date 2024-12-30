import { Test, TestingModule } from '@nestjs/testing';
import { CandidateTestService } from './candidate_test.service';

describe('CandidateTestService', () => {
  let service: CandidateTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidateTestService],
    }).compile();

    service = module.get<CandidateTestService>(CandidateTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
