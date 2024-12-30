import { Test, TestingModule } from '@nestjs/testing';
import { JobTestService } from './job_test.service';

describe('JobTestService', () => {
  let service: JobTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobTestService],
    }).compile();

    service = module.get<JobTestService>(JobTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
