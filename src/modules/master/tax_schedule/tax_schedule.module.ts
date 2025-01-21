import { Module } from '@nestjs/common';
import { TaxScheduleController } from './tax_schedule.controller';
import { TaxScheduleService } from './tax_schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxSchedule } from 'src/repository/master/tax_schedule.entity';

@Module({
  controllers: [TaxScheduleController],
  providers: [TaxScheduleService],
  imports: [
    TypeOrmModule.forFeature([TaxSchedule])
  ]
})
export class TaxScheduleModule {}
