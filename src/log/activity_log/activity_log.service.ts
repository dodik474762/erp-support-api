import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLog } from 'src/repository/master/activity_log.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class ActivityLogService {
    constructor(
        @InjectRepository(ActivityLog)
        private logRepo: Repository<ActivityLog>,
    ) {}

    async create (log: any) {
        return await this.logRepo.save(log);
    }

    async getAll(limit: string): Promise<any> {
        if(limit != '') {
            return this.logRepo.createQueryBuilder('activity_log')
            .select(['activity_log.*', 'users.username as username'])
            .innerJoin('users', 'users', 'users.id = activity_log.users')
            .where('activity_log.deleted IS NULL')
            .limit(Number(limit))
            .getRawMany();
        }
        return this.logRepo.createQueryBuilder('activity_log')
        .select(['activity_log.*', 'users.username as username'])
        .innerJoin('users', 'users', 'users.id = activity_log.users')
            .where('activity_log.deleted IS NULL')            
            .getRawMany();
    }

    async get(order: any, search: any, page: number, limit: number, filterdate: string): Promise<any[]> {
        const data = this.logRepo.createQueryBuilder('activity_log')
        .select(['activity_log.*'])
        .where('activity_log.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`activity_log.table_db LIKE '%${search}%'`)
                .orWhere(`activity_log.remarks LIKE '%${search}%'`);
            })
        )
        .andWhere(
            new Brackets((qb) => {
                if (filterdate != '') {
                    const dataDate = filterdate.split(' to ');
                    if (dataDate.length == 2) {
                        qb.where(`activity_log.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`);
                    }
                    if (dataDate.length == 1) {
                        qb.where(`cast(activity_log.created_at as date) = '${dataDate[0]}'`);
                    }
                }
            })
        )
        .orderBy(`activity_log.${order}`, 'DESC')
        .limit(limit)
        .offset((page - 1) * limit);
       
        return data.getRawMany();
    }

    async countAll(search: any): Promise<any> {
        return this.logRepo.createQueryBuilder('activity_log')
        .select(['activity_log.*'])
        .where('activity_log.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`activity_log.table_db LIKE '%${search}%'`)
                .orWhere(`activity_log.remarks LIKE '%${search}%'`);
            })
        )
        .getCount();        
    }
}
