import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/repository/master/roles.entity';

@Module({
  controllers: [RolesController],
  imports: [TypeOrmModule.forFeature([Roles],),],
  providers: [RolesService]
})
export class RolesModule {}
