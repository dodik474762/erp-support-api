import { Test, TestingModule } from '@nestjs/testing';
import { RouteAccController } from './route_acc.controller';

describe('RouteAccController', () => {
  let controller: RouteAccController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteAccController],
    }).compile();

    controller = module.get<RouteAccController>(RouteAccController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
