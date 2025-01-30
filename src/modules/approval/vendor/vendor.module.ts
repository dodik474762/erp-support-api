import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from 'src/repository/transaction/request_vendor.entity';
import { RoutingHeader } from 'src/repository/master/routing_header.entity';
import { RoutingPermission } from 'src/repository/master/routing_permission.entity';
import { Actors } from 'src/repository/master/actor.entity';
import { DocumentTransaction } from 'src/repository/master/document_transaction.entity';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';

@Module({
  controllers: [VendorController],
  providers: [VendorService, RouteAccService],
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
export class VendorModule {}
