import { Test, TestingModule } from '@nestjs/testing';
import { SubsidiaryController } from './subsidiary.controller';

describe('SubsidiaryController', () => {
  let controller: SubsidiaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubsidiaryController],
    }).compile();

    controller = module.get<SubsidiaryController>(SubsidiaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
