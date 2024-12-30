import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Candidate } from 'src/repository/rekrutmen/candidate.entity';
import { Brackets, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class CandidateService {
    constructor(
        @InjectRepository(Candidate)
        private candidateRepo: Repository<Candidate>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ){}

    async getAll(): Promise<any> {
        return this.candidateRepo.createQueryBuilder('candidate')
        .select(['candidate.*'])
        .where('candidate.deleted IS NULL')
        .getRawMany();
    }

    async get(order: any, search: any, page: number, limit: number, filterdate: string): Promise<any[]> {
        const data = this.candidateRepo.createQueryBuilder('candidate')
        .select(['candidate.*'])
        .where('candidate.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`candidate.nama_lengkap LIKE '%${search}%'`)
                .orWhere(`candidate.contact LIKE '%${search}%'`)
                .orWhere(`candidate.email LIKE '%${search}%'`)
                .orWhere(`candidate.nik LIKE '%${search}%'`)
                .orWhere(`candidate.alamat LIKE '%${search}%'`);
            })
        )
        .andWhere(
            new Brackets((qb) => {
                if (filterdate != '') {
                    const dataDate = filterdate.split(' to ');
                    if (dataDate.length == 2) {
                        qb.where(`candidate.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`);
                    }
                    if (dataDate.length == 1) {
                        qb.where(`cast(candidate.created_at as date) = '${dataDate[0]}'`);
                    }
                }
            })
        )
        .orderBy(`candidate.${order}`, 'DESC')
        .limit(limit)
        .offset((page - 1) * limit);
       
        return data.getRawMany();
    }

    async getDetail(id: string): Promise<any> {
        return this.candidateRepo.createQueryBuilder('candidate')
        .select(['candidate.*'])
        .where('candidate.deleted IS NULL')
        .andWhere('candidate.id = :id', { id: id })
        .getRawOne();
    }

    async countAll(search: any): Promise<any> {
        return this.candidateRepo.createQueryBuilder('candidate')
        .select(['candidate.*'])
        .where('candidate.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`candidate.nama_lengkap LIKE '%${search}%'`)
                .orWhere(`candidate.nik LIKE '%${search}%'`)
                .orWhere(`candidate.contact LIKE '%${search}%'`)
                .orWhere(`candidate.email LIKE '%${search}%'`)
                .orWhere(`candidate.alamat LIKE '%${search}%'`);
            })
        )
        .getCount();        
    }

    async save(roles) : Promise<any>{
        const result :any= {
            is_valid: false,
            data: null,
            message: 'Failed'
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await this.entityManager.transaction(async (queryRunner) => {
            console
            if (roles.id != '') {
                roles.updated_at = new Date();                
            }else{
                roles.id = null;
            }
            result.data = await roles.id != '' && roles.id != null ? this.candidateRepo.update(roles.id, roles) : this.candidateRepo.save(roles);
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
            result.data = await this.candidateRepo.update(id, { deleted: new Date() });
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
            result.data = await this.candidateRepo.update({ id: In(id) }, { deleted: new Date() });
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }
}
