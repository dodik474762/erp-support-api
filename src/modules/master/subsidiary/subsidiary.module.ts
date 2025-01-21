import { Module } from '@nestjs/common';
import { SubsidiaryController } from './subsidiary.controller';
import { SubsidiaryService } from './subsidiary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subsidiary } from 'src/repository/master/subsidiary.entity';

@Module({
  controllers: [SubsidiaryController],
  providers: [SubsidiaryService],
  imports: [
    TypeOrmModule.forFeature([Subsidiary])
  ]
})
export class SubsidiaryModule {}
