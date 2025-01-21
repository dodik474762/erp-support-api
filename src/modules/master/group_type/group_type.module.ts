import { Module } from '@nestjs/common';
import { GroupTypeController } from './group_type.controller';
import { GroupTypeService } from './group_type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupType } from 'src/repository/master/group_type.entity';

@Module({
  controllers: [GroupTypeController],
  providers: [GroupTypeService],
  imports: [
    TypeOrmModule.forFeature([GroupType])
  ]
})
export class GroupTypeModule {}
