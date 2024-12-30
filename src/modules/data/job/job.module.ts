import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/repository/rekrutmen/job.entity';

@Module({
  controllers: [JobController],
  providers: [JobService],
  imports: [
    TypeOrmModule.forFeature([Job]),
  ],
})
export class JobModule {
  
}
