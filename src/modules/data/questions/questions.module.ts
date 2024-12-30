import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestQuestionItem } from 'src/repository/rekrutmen/test_question_item.entity';
import { TestSub } from 'src/repository/rekrutmen/test_sub.entity';
import { Test } from 'src/repository/rekrutmen/test.entity';
import { TestAnswer } from 'src/repository/rekrutmen/test_answer.entity';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [
    TypeOrmModule.forFeature([
      TestQuestionItem,
      TestSub,
      Test,
      TestAnswer
    ])
  ]
})
export class QuestionsModule {}
