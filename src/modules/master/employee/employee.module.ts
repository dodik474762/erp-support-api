import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/repository/master/employee.entity';

@Module({
  providers: [EmployeeService],
  controllers: [EmployeeController],
  imports: [
    TypeOrmModule.forFeature([Employee]),
  ],
})
export class EmployeeModule {}
