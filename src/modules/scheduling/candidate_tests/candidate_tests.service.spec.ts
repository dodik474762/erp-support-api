import { Test, TestingModule } from '@nestjs/testing';
import { CandidateTestsService } from './candidate_tests.service';

describe('CandidateTestsService', () => {
  let service: CandidateTestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidateTestsService],
    }).compile();

    service = module.get<CandidateTestsService>(CandidateTestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
