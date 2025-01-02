import { Module } from '@nestjs/common';
import { RequestItemController } from './request_item.controller';
import { RequestItemService } from './request_item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestItem } from 'src/repository/transaction/request_item.entity';

@Module({
  controllers: [RequestItemController],
  providers: [RequestItemService],
  imports: [
    TypeOrmModule.forFeature([RequestItem])
  ]
})
export class RequestItemModule {}
