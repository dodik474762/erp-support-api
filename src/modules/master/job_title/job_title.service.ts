import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { JobTitle } from 'src/repository/master/job_title.entity';
import Core from 'src/utils/core';
import { Brackets, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class JobTitleService {
    constructor(
        @InjectRepository(JobTitle)
        private jobTitleRepo: Repository<JobTitle>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ){}

    async getAll(): Promise<any> {
        return this.jobTitleRepo.createQueryBuilder('job_title')
        .select(['job_title.*'])
        .where('job_title.deleted IS NULL')
        .getRawMany();
    }

    async get(order: any, search: any, page: number, limit: number, filterdate: string): Promise<any[]> {
        const data = this.jobTitleRepo.createQueryBuilder('job_title')
        .select(['job_title.*'])
        .where('job_title.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`job_title.job_name LIKE '%${search}%'`)
                .orWhere(`job_title.job_title_code LIKE '%${search}%'`);
            })
        )
        .andWhere(
            new Brackets((qb) => {
                if (filterdate != '') {
                    const dataDate = filterdate.split(' to ');
                    if (dataDate.length == 2) {
                        qb.where(`job_title.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`);
                    }
                    if (dataDate.length == 1) {
                        qb.where(`cast(job_title.created_at as date) = '${dataDate[0]}'`);
                    }
                }
            })
        )
        .orderBy(`job_title.${order}`, 'DESC')
        .limit(limit)
        .offset((page - 1) * limit);
       
        return data.getRawMany();
    }

    async getDetail(id: string): Promise<any> {
        return this.jobTitleRepo.createQueryBuilder('job_title')
        .select(['job_title.*'])
        .where('job_title.deleted IS NULL')
        .andWhere('job_title.id = :id', { id: id })
        .getRawOne();
    }

    async countAll(search: any): Promise<any> {
        return this.jobTitleRepo.createQueryBuilder('job_title')
        .select(['job_title.*'])
        .where('job_title.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`job_title.job_name LIKE '%${search}%'`)
                .orWhere(`job_title.job_title_code LIKE '%${search}%'`);
            })
        )
        .getCount();        
    }

    async save(params) : Promise<any>{
        const result:any = {
            is_valid: false,
            data: null,
            message: 'Failed'
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await this.entityManager.transaction(async (queryRunner) => {
            console
            if (params.id != '') {
                params.updated_at = new Date();                
            }else{
                params.id = null;
            }
            result.data = await params.id != '' && params.id != null ? this.jobTitleRepo.update(params.id, params) : this.jobTitleRepo.save(params);
            result.is_valid = true;
            result.message = 'Success';
            result.statusCode = 200;
        }).catch((error) => {
            result.message = String(error);
        })
        return result;
    }

    async delete(id: string): Promise<any> {
        const result = {
            is_valid: false,
            data: null,
            message: 'Failed'
        };
        try {            
            result.data = await this.jobTitleRepo.update(id, { deleted: new Date() });
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }
    
    async deleteAll(id: string[]): Promise<any> {
        const result = {
            is_valid: false,
            data: null,
            message: 'Failed'
        };
        try {           
            result.data = await this.jobTitleRepo.update({ id: In(id) }, { deleted: new Date() });
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }

    async generateCode(): Promise<any> {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        let no = 'JOB-' + year + month+"-";
        
        const data = await this.jobTitleRepo.createQueryBuilder('job_title')
        .select(['job_title.*'])
        .where('job_title.deleted IS NULL')
        .andWhere(`job_title.job_title_code LIKE '${no}%'`)
        .orderBy({ created_at: 'DESC' })
        .limit(1)
        .getRawOne();
        let sequence: string = '1';
        if (data) {
            sequence = data['job_title_code'].replace(no, '');
            sequence = String(Number(sequence) + 1);
        }

        sequence = Core.digitCount(4, sequence);
        no += sequence;
        
        return no;
    }
}
