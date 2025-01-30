import { Module } from '@nestjs/common';
import { RequestVendorController } from './request_vendor.controller';
import { RequestVendorService } from './request_vendor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from 'src/repository/transaction/request_vendor.entity';
import { RoutingHeader } from 'src/repository/master/routing_header.entity';
import { RoutingPermission } from 'src/repository/master/routing_permission.entity';
import { Actors } from 'src/repository/master/actor.entity';
import { DocumentTransaction } from 'src/repository/master/document_transaction.entity';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';

@Module({
  controllers: [RequestVendorController],
  providers: [RequestVendorService, RouteAccService],
  imports: [
    TypeOrmModule.forFeature([
      Vendor,
      RoutingHeader,
      RoutingPermission,
      Actors,
      DocumentTransaction,
    ]),
  ],
})
export class RequestVendorModule {}
