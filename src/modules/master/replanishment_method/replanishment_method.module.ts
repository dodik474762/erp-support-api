import { Module } from '@nestjs/common';
import { ReplanishmentMethodController } from './replanishment_method.controller';
import { ReplanishmentMethodService } from './replanishment_method.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplanishmentMethod } from 'src/repository/master/replanishment_method.entity';

@Module({
  controllers: [ReplanishmentMethodController],
  providers: [ReplanishmentMethodService],
  imports: [
    TypeOrmModule.forFeature([ReplanishmentMethod]) // Add Entity here
  ]
})
export class ReplanishmentMethodModule {}
