import { Module } from '@nestjs/common';
import { CandidateTestsController } from './candidate_tests.controller';
import { CandidateTestsService } from './candidate_tests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateScheduleTest } from 'src/repository/rekrutmen/candidate_schedule_test.entity';
import { CandidateScheduleTestSub } from 'src/repository/rekrutmen/candidate_schedule_test_sub.entity';
import { TestQuestionItem } from 'src/repository/rekrutmen/test_question_item.entity';

@Module({
  controllers: [CandidateTestsController],
  providers: [CandidateTestsService],
  imports: [
    TypeOrmModule.forFeature([
      CandidateScheduleTest,
      CandidateScheduleTestSub,
      TestQuestionItem
    ])
  ],
})
export class CandidateTestsModule {}
