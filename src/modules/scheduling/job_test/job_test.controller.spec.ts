import { Test, TestingModule } from '@nestjs/testing';
import { JobTestController } from './job_test.controller';

describe('JobTestController', () => {
  let controller: JobTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobTestController],
    }).compile();

    controller = module.get<JobTestController>(JobTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
