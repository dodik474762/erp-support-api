import { Module } from '@nestjs/common';
import { ProductTypeController } from './product_type.controller';
import { ProductTypeService } from './product_type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from 'src/repository/master/product_type.entity';

@Module({
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  imports: [
    TypeOrmModule.forFeature([ProductType])
  ]
})
export class ProductTypeModule {}
