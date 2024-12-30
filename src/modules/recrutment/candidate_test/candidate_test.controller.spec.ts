import { Test, TestingModule } from '@nestjs/testing';
import { CandidateTestController } from './candidate_test.controller';

describe('CandidateTestController', () => {
  let controller: CandidateTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateTestController],
    }).compile();

    controller = module.get<CandidateTestController>(CandidateTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
