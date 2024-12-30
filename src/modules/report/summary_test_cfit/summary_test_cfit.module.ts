import { Module } from '@nestjs/common';
import { SummaryTestCfitController } from './summary_test_cfit.controller';
import { SummaryTestCfitService } from './summary_test_cfit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateApplied } from 'src/repository/rekrutmen/candidate_applied.entity';
import { Candidate } from 'src/repository/rekrutmen/candidate.entity';
import { CandidateScheduleTestSub } from 'src/repository/rekrutmen/candidate_schedule_test_sub.entity';
import { CandidateScheduleTest } from 'src/repository/rekrutmen/candidate_schedule_test.entity';
import { TestAnswer } from 'src/repository/rekrutmen/test_answer.entity';
import { NormaTestCfit } from 'src/repository/rekrutmen/norma_test_cfit.entity';
import { TestQuestionItem } from 'src/repository/rekrutmen/test_question_item.entity';
import { CreplinCategory } from 'src/repository/master/creplin_category.entity';
import { CandidateSummary } from 'src/repository/rekrutmen/candidate_summary.entity';
import { CandidateSummaryDescribe } from 'src/repository/rekrutmen/candidate_summary_desc.entity';
import { CandidateScheduleTestAnswer } from 'src/repository/rekrutmen/candidate_schedule_test_answer.entity';

@Module({
  controllers: [SummaryTestCfitController],
  providers: [SummaryTestCfitService],
  imports: [
    TypeOrmModule.forFeature([
      CandidateApplied,
      Candidate,
      CandidateScheduleTestSub,
      CandidateScheduleTest,
      TestAnswer,
      NormaTestCfit,
      TestQuestionItem,
      CreplinCategory,
      CandidateSummary,
      CandidateSummaryDescribe,
      CandidateScheduleTestAnswer
    ])
  ],
})
export class SummaryTestCfitModule {}
