import { Test, TestingModule } from '@nestjs/testing';
import { ReplanishmentMethodController } from './replanishment_method.controller';

describe('ReplanishmentMethodController', () => {
  let controller: ReplanishmentMethodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReplanishmentMethodController],
    }).compile();

    controller = module.get<ReplanishmentMethodController>(ReplanishmentMethodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
