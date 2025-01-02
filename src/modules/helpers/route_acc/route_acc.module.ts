import { Module } from '@nestjs/common';
import { RouteAccController } from './route_acc.controller';
import { RouteAccService } from './route_acc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutingHeader } from 'src/repository/master/routing_header.entity';
import { RoutingPermission } from 'src/repository/master/routing_permission.entity';

@Module({
  controllers: [RouteAccController],
  providers: [RouteAccService],
  imports: [
    TypeOrmModule.forFeature([
      RoutingHeader,
      RoutingPermission
    ])
  ],
  exports: [RouteAccService]
})
export class RouteAccModule {}
