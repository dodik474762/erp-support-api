import { Module } from '@nestjs/common';
import { CostCategoryController } from './cost_category.controller';
import { CostCategoryService } from './cost_category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostCategory } from 'src/repository/master/cost_category.entity';

@Module({
  controllers: [CostCategoryController],
  providers: [CostCategoryService],
  imports: [
    TypeOrmModule.forFeature([CostCategory])
  ]
})
export class CostCategoryModule {}
