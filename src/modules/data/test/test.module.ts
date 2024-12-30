import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from 'src/repository/rekrutmen/test.entity';
import { TestSub } from 'src/repository/rekrutmen/test_sub.entity';
import { TestIntroduction } from 'src/repository/rekrutmen/test_introduction.entity';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [
    TypeOrmModule.forFeature([Test, TestSub, TestIntroduction]),
  ]
})
export class TestModule {}
