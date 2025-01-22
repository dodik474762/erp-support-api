import { Module } from '@nestjs/common';
import { PriceTypeController } from './price_type.controller';
import { PriceTypeService } from './price_type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceType } from 'src/repository/master/price_type.entity';

@Module({
  controllers: [PriceTypeController],
  providers: [PriceTypeService],
  imports: [
    TypeOrmModule.forFeature([PriceType])
  ],
})
export class PriceTypeModule {}
