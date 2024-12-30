import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsDescribeController } from './questions_describe.controller';

describe('QuestionsDescribeController', () => {
  let controller: QuestionsDescribeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsDescribeController],
    }).compile();

    controller = module.get<QuestionsDescribeController>(QuestionsDescribeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
