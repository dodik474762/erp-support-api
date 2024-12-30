import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsDescribeService } from './questions_describe.service';

describe('QuestionsDescribeService', () => {
  let service: QuestionsDescribeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsDescribeService],
    }).compile();

    service = module.get<QuestionsDescribeService>(QuestionsDescribeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
