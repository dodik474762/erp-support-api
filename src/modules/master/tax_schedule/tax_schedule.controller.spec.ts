import { Test, TestingModule } from '@nestjs/testing';
import { TaxScheduleController } from './tax_schedule.controller';

describe('TaxScheduleController', () => {
  let controller: TaxScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxScheduleController],
    }).compile();

    controller = module.get<TaxScheduleController>(TaxScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
