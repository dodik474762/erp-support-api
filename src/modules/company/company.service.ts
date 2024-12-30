import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/repository/master/company_entity';
import Core from 'src/utils/core';
import { Brackets, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepo: Repository<Company>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ){}

    async getAll(): Promise<any> {
        return this.companyRepo.createQueryBuilder('company')
        .select(['company.*'])
        .where('company.deleted IS NULL')
        .getRawMany();
    }

    async get(order: any, search: any, page: number, limit: number, filterdate: string): Promise<any[]> {
        const data = this.companyRepo.createQueryBuilder('company')
        .select(['company.*'])
        .where('company.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`company.nama LIKE '%${search}%'`)
                .orWhere(`company.code LIKE '%${search}%'`);
            })
        )
        .andWhere(
            new Brackets((qb) => {
                if (filterdate != '') {
                    const dataDate = filterdate.split(' to ');
                    if (dataDate.length == 2) {
                        qb.where(`company.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`);
                    }
                    if (dataDate.length == 1) {
                        qb.where(`cast(company.created_at as date) = '${dataDate[0]}'`);
                    }
                }
            })
        )
        .orderBy(`company.${order}`, 'DESC')
        .limit(limit)
        .offset((page - 1) * limit);
       
        return data.getRawMany();
    }

    async getDetail(id: string): Promise<any> {
        return this.companyRepo.createQueryBuilder('company')
        .select(['company.*'])
        .where('company.deleted IS NULL')
        .andWhere('company.id = :id', { id: id })
        .getRawOne();
    }

    async countAll(search: any): Promise<any> {
        return this.companyRepo.createQueryBuilder('company')
        .select(['company.*'])
        .where('company.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`company.nama LIKE '%${search}%'`)
                .orWhere(`company.code LIKE '%${search}%'`);
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
            result.data = await roles.id != '' && roles.id != null ? this.companyRepo.update(roles.id, roles) : this.companyRepo.save(roles);
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
            result.data = await this.companyRepo.update(id, { deleted: new Date() });
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
            result.data = await this.companyRepo.update({ id: In(id) }, { deleted: new Date() });
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
        let no = 'C-' + year + month+"-";
        
        const data = await this.companyRepo.createQueryBuilder('company')
        .select(['company.*'])
        .where('company.deleted IS NULL')
        .andWhere(`company.code LIKE '${no}%'`)
        .orderBy({ created_at: 'DESC' })
        .limit(1)
        .getRawOne();
        let sequence: string = '1';
        if (data) {
            sequence = data['code'].replace(no, '');
            sequence = String(Number(sequence) + 1);
        }

        sequence = Core.digitCount(4, sequence);
        no += sequence;
        
        return no;
    }
}
