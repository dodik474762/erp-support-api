import { Test, TestingModule } from '@nestjs/testing';
import { TaxScheduleService } from './tax_schedule.service';

describe('TaxScheduleService', () => {
  let service: TaxScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxScheduleService],
    }).compile();

    service = module.get<TaxScheduleService>(TaxScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
