import { Module } from '@nestjs/common';
import { PlanningItemController } from './planning_item.controller';
import { PlanningItemService } from './planning_item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanningItem } from 'src/repository/master/planning_item.entity';

@Module({
  controllers: [PlanningItemController],
  providers: [PlanningItemService],
  imports: [
    TypeOrmModule.forFeature([PlanningItem])
  ]
})
export class PlanningItemModule {}
