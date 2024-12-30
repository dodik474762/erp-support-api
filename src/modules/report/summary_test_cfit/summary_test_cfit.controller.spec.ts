import { Test, TestingModule } from '@nestjs/testing';
import { SummaryTestCfitController } from './summary_test_cfit.controller';

describe('SummaryTestCfitController', () => {
  let controller: SummaryTestCfitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummaryTestCfitController],
    }).compile();

    controller = module.get<SummaryTestCfitController>(SummaryTestCfitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
