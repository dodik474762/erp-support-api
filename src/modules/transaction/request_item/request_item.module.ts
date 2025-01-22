import { Module } from '@nestjs/common';
import { RequestItemController } from './request_item.controller';
import { RequestItemService } from './request_item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestItem } from 'src/repository/transaction/request_item.entity';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';
import { RoutingHeader } from 'src/repository/master/routing_header.entity';
import { RoutingPermission } from 'src/repository/master/routing_permission.entity';
import { Actors } from 'src/repository/master/actor.entity';
import { DocumentTransaction } from 'src/repository/master/document_transaction.entity';
import { RequestItemSalesPrice } from 'src/repository/transaction/request_item_sales_price.entity';

@Module({
  controllers: [RequestItemController],
  providers: [RequestItemService, RouteAccService],
  imports: [
    TypeOrmModule.forFeature([
      RequestItem,
      RequestItemSalesPrice,
      RoutingHeader,
      RoutingPermission,
      Actors,
      DocumentTransaction,
    ]),
  ],
})
export class RequestItemModule {}
