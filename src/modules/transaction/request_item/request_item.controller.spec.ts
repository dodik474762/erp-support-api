import { Test, TestingModule } from '@nestjs/testing';
import { RequestItemController } from './request_item.controller';

describe('RequestItemController', () => {
  let controller: RequestItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestItemController],
    }).compile();

    controller = module.get<RequestItemController>(RequestItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
