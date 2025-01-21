import { Test, TestingModule } from '@nestjs/testing';
import { PlanningItemService } from './planning_item.service';

describe('PlanningItemService', () => {
  let service: PlanningItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanningItemService],
    }).compile();

    service = module.get<PlanningItemService>(PlanningItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
