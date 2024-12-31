import { Module } from '@nestjs/common';
import { RoutingController } from './routing.controller';
import { RoutingService } from './routing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutingHeader } from 'src/repository/master/routing_header.entity';
import { RoutingPermission } from 'src/repository/master/routing_permission.entity';

@Module({
  controllers: [RoutingController],
  providers: [RoutingService],
  imports: [
    TypeOrmModule.forFeature([RoutingHeader, RoutingPermission])
  ]
})
export class RoutingModule {}
