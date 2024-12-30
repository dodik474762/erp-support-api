import { Module } from '@nestjs/common';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from 'src/repository/master/unit.entity';

@Module({
  controllers: [UnitController],
  providers: [UnitService],
  imports: [
    TypeOrmModule.forFeature([Unit]),
  ],
})
export class UnitModule {}
