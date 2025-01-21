import { Test, TestingModule } from '@nestjs/testing';
import { VolumeTypeController } from './volume_type.controller';

describe('VolumeTypeController', () => {
  let controller: VolumeTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VolumeTypeController],
    }).compile();

    controller = module.get<VolumeTypeController>(VolumeTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
