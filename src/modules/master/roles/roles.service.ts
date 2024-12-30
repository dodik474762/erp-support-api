import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/repository/master/roles.entity';
import Core from 'src/utils/core';
import { Brackets, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Roles)
        private rolesRepo: Repository<Roles>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ){}

    async getAll(): Promise<any> {
        return this.rolesRepo.createQueryBuilder('roles')
        .select(['roles.*'])
        .where('roles.deleted IS NULL')
        .getRawMany();
    }

    async get(order: any, search: any, page: number, limit: number, filterdate: string): Promise<any[]> {
        const data = this.rolesRepo.createQueryBuilder('roles')
        .select(['roles.*'])
        .where('roles.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`roles.roles_name LIKE '%${search}%'`)
                .orWhere(`roles.roles_code LIKE '%${search}%'`);
            })
        )
        .andWhere(
            new Brackets((qb) => {
                if (filterdate != '') {
                    const dataDate = filterdate.split(' to ');
                    if (dataDate.length == 2) {
                        qb.where(`roles.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`);
                    }
                    if (dataDate.length == 1) {
                        qb.where(`cast(roles.created_at as date) = '${dataDate[0]}'`);
                    }
                }
            })
        )
        .orderBy(`roles.${order}`, 'DESC')
        .take(limit)
        .skip((page - 1) * limit);
       
        return data.getRawMany();
    }

    async getDetail(id: string): Promise<any> {
        return this.rolesRepo.createQueryBuilder('roles')
        .select(['roles.*'])
        .where('roles.deleted IS NULL')
        .andWhere('roles.id = :id', { id: id })
        .getRawOne();
    }

    async countAll(search: any): Promise<any> {
        return this.rolesRepo.createQueryBuilder('roles')
        .select(['roles.*'])
        .where('roles.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`roles.roles_name LIKE '%${search}%'`)
                .orWhere(`roles.roles_code LIKE '%${search}%'`);
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
            result.data = await roles.id != '' && roles.id != null ? this.rolesRepo.update(roles.id, roles) : this.rolesRepo.save(roles);
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
            result.data = await this.rolesRepo.update(id, { deleted: new Date() });
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
            result.data = await this.rolesRepo.update({ id: In(id) }, { deleted: new Date() });
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
        let no = 'ROLE-' + year + month+"-";
        
        const data = await this.rolesRepo.createQueryBuilder('roles')
        .select(['roles.*'])
        .where('roles.deleted IS NULL')
        .andWhere(`roles.roles_code LIKE '${no}%'`)
        .orderBy({ created_at: 'DESC' })
        .limit(1)
        .getRawOne();
        let sequence: string = '1';
        if (data) {
            sequence = data['roles_code'].replace(no, '');
            sequence = String(Number(sequence) + 1);
        }

        sequence = Core.digitCount(4, sequence);
        no += sequence;
        
        return no;
    }
}
