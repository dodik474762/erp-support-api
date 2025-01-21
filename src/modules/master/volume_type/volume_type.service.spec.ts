import { Test, TestingModule } from '@nestjs/testing';
import { VolumeTypeService } from './volume_type.service';

describe('VolumeTypeService', () => {
  let service: VolumeTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VolumeTypeService],
    }).compile();

    service = module.get<VolumeTypeService>(VolumeTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
