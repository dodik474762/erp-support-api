import { Module } from '@nestjs/common';
import { QuestionsDescribeController } from './questions_describe.controller';
import { QuestionsDescribeService } from './questions_describe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestQuestionDescItem } from 'src/repository/master/test_question_desc_item.entity';
import { TestAnswer } from 'src/repository/rekrutmen/test_answer.entity';
import { TestAnswerDescribe } from 'src/repository/master/test_answer_describe.entity';

@Module({
  controllers: [QuestionsDescribeController],
  providers: [QuestionsDescribeService],
  imports: [
    TypeOrmModule.forFeature([
      TestQuestionDescItem,
      TestAnswer,
      TestAnswerDescribe
    ]),
  ],
})
export class QuestionsDescribeModule {}
