import { Module } from '@nestjs/common';
import { VolumeTypeController } from './volume_type.controller';
import { VolumeTypeService } from './volume_type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolumeType } from 'src/repository/master/volume_type.entity';

@Module({
  controllers: [VolumeTypeController],
  providers: [VolumeTypeService],
  imports: [
    TypeOrmModule.forFeature([VolumeType])
  ]
})
export class VolumeTypeModule {}
