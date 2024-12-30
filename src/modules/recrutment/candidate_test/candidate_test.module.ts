import { Module } from '@nestjs/common';
import { CandidateTestController } from './candidate_test.controller';
import { CandidateTestService } from './candidate_test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from 'src/repository/rekrutmen/test.entity';
import { TestSub } from 'src/repository/rekrutmen/test_sub.entity';
import { TestIntroduction } from 'src/repository/rekrutmen/test_introduction.entity';
import { Candidate } from 'src/repository/rekrutmen/candidate.entity';
import { Job } from 'src/repository/rekrutmen/job.entity';
import { JobScheduleTest } from 'src/repository/rekrutmen/job_schedule_test.entity';
import { JobScheduleTestItem } from 'src/repository/rekrutmen/job_schedule_test_item.entity';
import { CandidateApplied } from 'src/repository/rekrutmen/candidate_applied.entity';
import { CandidateScheduleTest } from 'src/repository/rekrutmen/candidate_schedule_test.entity';
import { CandidateScheduleTestSub } from 'src/repository/rekrutmen/candidate_schedule_test_sub.entity';
import { TestQuestionItem } from 'src/repository/rekrutmen/test_question_item.entity';
import { TestAnswer } from 'src/repository/rekrutmen/test_answer.entity';
import { CandidateScheduleTestAnswer } from '../../../repository/rekrutmen/candidate_schedule_test_answer.entity';
import { CandidateJobStep } from 'src/repository/rekrutmen/candidate_job_step.entity';
import { CandidateJobLogStep } from 'src/repository/rekrutmen/candidate_job_log_step.entity';
import { CandidateScheduleTestSubPicture } from 'src/repository/rekrutmen/candidate_schedule_test_sub_picture.entity';
import { TestQuestionDescItem } from 'src/repository/master/test_question_desc_item.entity';
import { TestAnswerDescribe } from 'src/repository/master/test_answer_describe.entity';
import { JobTestService } from 'src/modules/scheduling/job_test/job_test.service';
import { JobScheduleTestAccept } from 'src/repository/rekrutmen/job_schedule_test_accept.entity';

@Module({
  controllers: [CandidateTestController],
  providers: [CandidateTestService, JobTestService],
  imports: [
    TypeOrmModule.forFeature([
      Test,
      TestSub,
      TestIntroduction,
      Candidate,
      Job,
      JobScheduleTest,
      JobScheduleTestItem,
      CandidateApplied,
      CandidateScheduleTest,
      CandidateScheduleTestSub,
      CandidateScheduleTestAnswer,
      CandidateJobStep,
      CandidateJobLogStep,
      CandidateScheduleTestSubPicture,
      TestQuestionItem,
      TestAnswer,
      TestQuestionDescItem,
      TestAnswerDescribe,
      JobScheduleTestAccept
    ]),
  ],
})
export class CandidateTestModule {}
