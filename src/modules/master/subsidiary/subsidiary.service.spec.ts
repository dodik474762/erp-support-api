import { Test, TestingModule } from '@nestjs/testing';
import { SubsidiaryService } from './subsidiary.service';

describe('SubsidiaryService', () => {
  let service: SubsidiaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubsidiaryService],
    }).compile();

    service = module.get<SubsidiaryService>(SubsidiaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
