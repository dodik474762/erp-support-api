import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { RouteAccService } from './route_acc.service';

@UseGuards(JwtAuthGuard)
@Controller('/api/helpers/route-acc')
export class RouteAccController {
  constructor(private services: RouteAccService) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Route Acc',
    };
  }
}
