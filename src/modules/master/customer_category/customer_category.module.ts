import { Module } from '@nestjs/common';
import { CustomerCategoryController } from './customer_category.controller';
import { CustomerCategoryService } from './customer_category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerCategory } from 'src/repository/master/customer_category.entity';

@Module({
  controllers: [CustomerCategoryController],
  providers: [CustomerCategoryService],
  imports: [
    TypeOrmModule.forFeature([CustomerCategory])
  ]
})
export class CustomerCategoryModule {}
