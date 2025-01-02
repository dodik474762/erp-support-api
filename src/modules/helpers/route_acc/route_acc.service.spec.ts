import { Test, TestingModule } from '@nestjs/testing';
import { RouteAccService } from './route_acc.service';

describe('RouteAccService', () => {
  let service: RouteAccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteAccService],
    }).compile();

    service = module.get<RouteAccService>(RouteAccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
