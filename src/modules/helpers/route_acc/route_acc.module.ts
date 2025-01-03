import { Module } from '@nestjs/common';
import { RouteAccController } from './route_acc.controller';
import { RouteAccService } from './route_acc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutingHeader } from 'src/repository/master/routing_header.entity';
import { RoutingPermission } from 'src/repository/master/routing_permission.entity';
import { Actors } from 'src/repository/master/actor.entity';
import { DocumentTransaction } from 'src/repository/master/document_transaction.entity';

@Module({
  controllers: [RouteAccController],
  providers: [RouteAccService],
  imports: [
    TypeOrmModule.forFeature([
      RoutingHeader,
      RoutingPermission,
      Actors,
      DocumentTransaction
    ])
  ],
  exports: [RouteAccService]
})
export class RouteAccModule {}
