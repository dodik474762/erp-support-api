import { Test, TestingModule } from '@nestjs/testing';
import { GroupTypeController } from './group_type.controller';

describe('GroupTypeController', () => {
  let controller: GroupTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupTypeController],
    }).compile();

    controller = module.get<GroupTypeController>(GroupTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
