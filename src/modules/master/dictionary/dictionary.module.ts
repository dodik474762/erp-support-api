import { Module } from '@nestjs/common';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from 'src/repository/master/dictionary.entity';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService],
  imports: [
    TypeOrmModule.forFeature([Dictionary]),
  ]
})
export class DictionaryModule {}
