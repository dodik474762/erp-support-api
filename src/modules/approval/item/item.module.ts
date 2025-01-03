import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestItem } from 'src/repository/transaction/request_item.entity';
import { RoutingHeader } from 'src/repository/master/routing_header.entity';
import { RoutingPermission } from 'src/repository/master/routing_permission.entity';
import { Actors } from 'src/repository/master/actor.entity';
import { DocumentTransaction } from 'src/repository/master/document_transaction.entity';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';

@Module({
  providers: [ItemService, RouteAccService],
  controllers: [ItemController],
  imports: [
    TypeOrmModule.forFeature([
      RequestItem,
      RoutingHeader,
      RoutingPermission,
      Actors,
      DocumentTransaction,
    ]),
  ],
})
export class ItemModule {}
