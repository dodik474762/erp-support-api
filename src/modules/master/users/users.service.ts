import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/repository/master/users.entity';
import { Brackets, EntityManager, In } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepo: Repository<Users>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ){}

    async getAll(): Promise<any> {
        return this.usersRepo.createQueryBuilder('users')
        .select(['users.*'])
        .where('users.deleted IS NULL')
        .getRawMany();
    }

    async get(order: any, search: any, page: number, limit: number, filterdate: string): Promise<any[]> {
        const data = this.usersRepo.createQueryBuilder('users')
        .select(['users.*', 'users_group.roles_name as roles_name'])
        .innerJoin('users_group', 'users_group', 'users.user_group = users_group.id')
        .where('users.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`users.username LIKE '%${search}%'`)
                .orWhere(`users.password LIKE '%${search}%'`)
                .orWhere(`users_group.roles_name LIKE '%${search}%'`);
            })
        )
        .andWhere(
            new Brackets((qb) => {
                if (filterdate != '') {
                    const dataDate = filterdate.split(' to ');
                    if (dataDate.length == 2) {
                        qb.where(`users.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`);
                    }
                    if (dataDate.length == 1) {
                        qb.where(`cast(users.created_at as date) = '${dataDate[0]}'`);
                    }
                }
            })
        )
        .orderBy(`users.${order}`, 'DESC')
        .limit(limit)
        .offset((page - 1) * limit);
       
        return data.getRawMany();
    }

    async getDetail(id: string): Promise<any> {
        return this.usersRepo.createQueryBuilder('users')
        .select(['users.*', 'users_group.roles_name as roles_name', 
        'employee.name as employee_name', 'employee.employee_code as employee_code'])
        .innerJoin('users_group', 'users_group', 'users.user_group = users_group.id')
        .leftJoin('employee', 'employee', 'users.employee_code = employee.employee_code')
        .where('users.deleted IS NULL')
        .andWhere('users.id = :id', { id: id })
        .getRawOne();
    }

    async countAll(search: any): Promise<any> {
        return this.usersRepo.createQueryBuilder('users')
        .select(['users.*'])
        .where('users.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`users.username LIKE '%${search}%'`)
                .orWhere(`users.password LIKE '%${search}%'`);
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
            result.data = await params.id != '' && params.id != null ? this.usersRepo.update(params.id, params) : this.usersRepo.save(params);
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
            result.data = await this.usersRepo.update(id, { deleted: new Date() });
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
            result.data = await this.usersRepo.update({ id: In(id) }, { deleted: new Date() });
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }
}
