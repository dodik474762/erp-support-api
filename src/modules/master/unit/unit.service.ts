import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Unit } from 'src/repository/master/unit.entity';
import Core from 'src/utils/core';
import { Brackets, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class UnitService {
    constructor(
        @InjectRepository(Unit)
        private unitRepo: Repository<Unit>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ){}

    async getAll(): Promise<any> {
        return this.unitRepo.createQueryBuilder('unit')
        .select(['unit.*'])
        .where('unit.deleted IS NULL')
        .getRawMany();
    }

    async get(order: any, search: any, page: number, limit: number, filterdate: string): Promise<any[]> {
        const data = this.unitRepo.createQueryBuilder('unit')
        .select(['unit.*'])
        .where('unit.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`unit.name LIKE '%${search}%'`)
                .orWhere(`unit.remarks LIKE '%${search}%'`);
            })
        )
        .andWhere(
            new Brackets((qb) => {
                if (filterdate != '') {
                    const dataDate = filterdate.split(' to ');
                    if (dataDate.length == 2) {
                        qb.where(`unit.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`);
                    }
                    if (dataDate.length == 1) {
                        qb.where(`cast(unit.created_at as date) = '${dataDate[0]}'`);
                    }
                }
            })
        )
        .orderBy(`unit.${order}`, 'DESC')
        .take(limit)
        .skip((page - 1) * limit);
       
        return data.getRawMany();
    }

    async getDetail(id: string): Promise<any> {
        return this.unitRepo.createQueryBuilder('unit')
        .select(['unit.*'])
        .where('unit.deleted IS NULL')
        .andWhere('unit.id = :id', { id: id })
        .getRawOne();
    }

    async countAll(search: any): Promise<any> {
        return this.unitRepo.createQueryBuilder('unit')
        .select(['unit.*'])
        .where('unit.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`unit.name LIKE '%${search}%'`)
                .orWhere(`unit.remarks LIKE '%${search}%'`);
            })
        )
        .getCount();        
    }

    async save(params) : Promise<any>{
        const result = {
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
            result.data = await params.id != '' && params.id != null ? this.unitRepo.update(params.id, params) : this.unitRepo.save(params);
            result.is_valid = true;
            result.message = 'Success';
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
            result.data = await this.unitRepo.update(id, { deleted: new Date() });
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
            result.data = await this.unitRepo.update({ id: In(id) }, { deleted: new Date() });
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
        let no = 'UNIT-' + year + month+"-";
        
        const data = await this.unitRepo.createQueryBuilder('unit')
        .select(['unit.*'])
        .where('unit.deleted IS NULL')
        .andWhere(`unit.remarks LIKE '${no}%'`)
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
