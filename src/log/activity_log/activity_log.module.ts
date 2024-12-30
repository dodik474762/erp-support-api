import { Module } from '@nestjs/common';
import { ActivityLogService } from './activity_log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from 'src/repository/master/activity_log.entity';
import { ActivityLogController } from './activity_log.controller';

@Module({
    providers: [
        ActivityLogService
    ],
    imports: [
        TypeOrmModule.forFeature([
            ActivityLog
        ])
    ],
    exports: [ActivityLogService],
    controllers: [ActivityLogController]
})
export class ActivityLogModule {}
