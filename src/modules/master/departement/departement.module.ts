import { Module } from '@nestjs/common';
import { DepartementController } from './departement.controller';
import { DepartementService } from './departement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/repository/master/departement.entity';

@Module({
  controllers: [DepartementController],
  providers: [DepartementService],
  imports: [
    TypeOrmModule.forFeature([Department])
  ]
})
export class DepartementModule {}
