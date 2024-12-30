import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PermissionUsers } from 'src/repository/master/permission_users.entity';
import { Brackets, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(PermissionUsers)
        private permissionRepo: Repository<PermissionUsers>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ){}

    async getAll(): Promise<any> {
        return this.permissionRepo.createQueryBuilder('permission_users')
        .select(['permission_users.*'])
        .where('permission_users.deleted IS NULL')
        .getRawMany();
    }
    
    async getParent(): Promise<any> {
        return this.permissionRepo.createQueryBuilder('permission_users')
        .select(['permission_users.*'])
        .andWhere('permission_users.deleted IS NULL')
        .getRawMany();
    }

    async get(order: any, search: any, page: number, limit: number, filterdate: string): Promise<any[]> {
        const data = this.permissionRepo.createQueryBuilder('permission_users')
        .select(['permission_users.*', 'users.username as username', 'menu.name as menu_name'])
        .innerJoin('menu', 'menu', 'menu.id = permission_users.menu')
        .innerJoin('users_group', 'users_group', 'users_group.id = permission_users.user_group')
        .innerJoin('users', 'users', 'users.user_group = users_group.id')
        .where('permission_users.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`permission_users.menu_code LIKE '%${search}%'`)
                .orWhere(`users.username LIKE '%${search}%'`)
                .orWhere(`permission_users.action LIKE '%${search}%'`);
            })
        )
        .andWhere(
            new Brackets((qb) => {
                if (filterdate != '') {
                    const dataDate = filterdate.split(' to ');
                    if (dataDate.length == 2) {
                        qb.where(`permission_users.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`);
                    }
                    if (dataDate.length == 1) {
                        qb.where(`cast(permission_users.created_at as date) = '${dataDate[0]}'`);
                    }
                }
            })
        )
        .orderBy(`permission_users.${order}`, 'DESC')
        .limit(limit)
        .offset((page - 1) * limit);
       
        return data.getRawMany();
    }

    async getDetail(id: string): Promise<any> {
        return this.permissionRepo.createQueryBuilder('permission_users')
        .select(['permission_users.*', 'users.username as username', 'menu.name as menu_name', 'users_group.roles_name as roles_name'])
        .innerJoin('menu', 'menu', 'menu.id = permission_users.menu')
        .innerJoin('users_group', 'users_group', 'users_group.id = permission_users.user_group')
        .innerJoin('users', 'users', 'users.user_group = users_group.id')
        .where('permission_users.deleted IS NULL')
        .andWhere('permission_users.id = :id', { id: id })
        .getRawOne();
    }

    async countAll(search: any): Promise<any> {
        return this.permissionRepo.createQueryBuilder('permission_users')
        .select(['permission_users.*'])
        .innerJoin('users_group', 'users_group', 'users_group.id = permission_users.user_group')
        .innerJoin('users', 'users', 'users.user_group = users_group.id')
        .where('permission_users.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`permission_users.menu_code LIKE '%${search}%'`)
                .orWhere(`users.username LIKE '%${search}%'`)
                .orWhere(`permission_users.action LIKE '%${search}%'`);
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
            if (params.id != '') {
                params.updated_at = new Date();                
            }else{
                params.id = null;
            }
            result.data = await params.id != '' && params.id != null ? this.permissionRepo.update(params.id, params) : this.permissionRepo.save(params);
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
            result.data = await this.permissionRepo.update(id, { deleted: new Date() });
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
            result.data = await this.permissionRepo.update({ id: In(id) }, { deleted: new Date() });
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }
}
