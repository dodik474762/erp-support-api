import { Test, TestingModule } from '@nestjs/testing';
import { GroupTypeService } from './group_type.service';

describe('GroupTypeService', () => {
  let service: GroupTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupTypeService],
    }).compile();

    service = module.get<GroupTypeService>(GroupTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
