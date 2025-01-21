import { Test, TestingModule } from '@nestjs/testing';
import { ReplanishmentMethodService } from './replanishment_method.service';

describe('ReplanishmentMethodService', () => {
  let service: ReplanishmentMethodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReplanishmentMethodService],
    }).compile();

    service = module.get<ReplanishmentMethodService>(ReplanishmentMethodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
