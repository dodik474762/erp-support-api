import { Test, TestingModule } from '@nestjs/testing';
import { JobTitleController } from './job_title.controller';

describe('JobTitleController', () => {
  let controller: JobTitleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobTitleController],
    }).compile();

    controller = module.get<JobTitleController>(JobTitleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
