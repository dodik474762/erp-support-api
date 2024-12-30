import { Module } from '@nestjs/common';
import { JobTestController } from './job_test.controller';
import { JobTestService } from './job_test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobScheduleTest } from 'src/repository/rekrutmen/job_schedule_test.entity';
import { JobScheduleTestItem } from 'src/repository/rekrutmen/job_schedule_test_item.entity';
import { Test } from 'src/repository/rekrutmen/test.entity';
import { JobScheduleTestAccept } from 'src/repository/rekrutmen/job_schedule_test_accept.entity';

@Module({
  controllers: [JobTestController],
  providers: [JobTestService],
  imports: [
    TypeOrmModule.forFeature([
      JobScheduleTest,
      JobScheduleTestItem,
      Test,
      JobScheduleTestAccept
    ])
  ]
})
export class JobTestModule {}
