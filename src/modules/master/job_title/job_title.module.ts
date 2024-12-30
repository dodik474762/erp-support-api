import { Module } from '@nestjs/common';
import { JobTitleController } from './job_title.controller';
import { JobTitleService } from './job_title.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobTitle } from 'src/repository/master/job_title.entity';

@Module({
  controllers: [JobTitleController],
  providers: [JobTitleService],
  imports: [
    TypeOrmModule.forFeature([JobTitle]),
  ],
})
export class JobTitleModule {}
