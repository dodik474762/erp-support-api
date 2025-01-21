import { Test, TestingModule } from '@nestjs/testing';
import { PlanningItemController } from './planning_item.controller';

describe('PlanningItemController', () => {
  let controller: PlanningItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanningItemController],
    }).compile();

    controller = module.get<PlanningItemController>(PlanningItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
