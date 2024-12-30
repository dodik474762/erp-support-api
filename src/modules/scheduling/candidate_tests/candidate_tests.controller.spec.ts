import { Test, TestingModule } from '@nestjs/testing';
import { CandidateTestsController } from './candidate_tests.controller';

describe('CandidateTestsController', () => {
  let controller: CandidateTestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateTestsController],
    }).compile();

    controller = module.get<CandidateTestsController>(CandidateTestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
