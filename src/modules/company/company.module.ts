import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/repository/master/company_entity';

@Module({
  providers: [CompanyService],
  controllers: [CompanyController],
  imports: [
    TypeOrmModule.forFeature([
      Company
    ])
  ]
})
export class CompanyModule {}
