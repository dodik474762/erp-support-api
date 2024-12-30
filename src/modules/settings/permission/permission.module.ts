import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionUsers } from 'src/repository/master/permission_users.entity';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  imports: [
    TypeOrmModule.forFeature([PermissionUsers]),
  ],
})
export class PermissionModule {}
