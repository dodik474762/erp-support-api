import { Module } from '@nestjs/common';
import { RequestCustomerController } from './request_customer.controller';
import { RequestCustomerService } from './request_customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/repository/transaction/request_customer.entity';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';
import { RoutingHeader } from 'src/repository/master/routing_header.entity';
import { RoutingPermission } from 'src/repository/master/routing_permission.entity';
import { Actors } from 'src/repository/master/actor.entity';
import { DocumentTransaction } from 'src/repository/master/document_transaction.entity';

@Module({
  controllers: [RequestCustomerController],
  providers: [RequestCustomerService, RouteAccService],
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      RoutingHeader,
      RoutingPermission,
      Actors,
      DocumentTransaction,
    ]),
  ],
})
export class RequestCustomerModule {}
