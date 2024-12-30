import { Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateApplied } from 'src/repository/rekrutmen/candidate_applied.entity';
import { Candidate } from 'src/repository/rekrutmen/candidate.entity';

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService],
  imports: [
    TypeOrmModule.forFeature([
      CandidateApplied,
      Candidate
    ])
  ],
})
export class CandidatesModule {}
