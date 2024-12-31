/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/repository/master/employee.entity';
import Core from 'src/utils/core';
import { Brackets, EntityManager, In } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private emplyeeRepo: Repository<Employee>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ){}

    async getAll(): Promise<any> {
        return this.emplyeeRepo.createQueryBuilder('employee')
        .select(['employee.*'])
        .where('employee.deleted IS NULL')
        .getRawMany();
    }

    async get(order: any, search: any, page: number, limit: number, filterdate: string): Promise<any[]> {
        const data = this.emplyeeRepo.createQueryBuilder('employee')
        .select(['employee.*', 'job_title.job_name as job_name'])
        .innerJoin('job_title', 'job_title', 'employee.job_title = job_title.id')
        .where('employee.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`employee.name LIKE '%${search}%'`)
                .orWhere(`employee.employee_code LIKE '%${search}%'`)
                .orWhere(`employee.address LIKE '%${search}%'`);
            })
        )
        .andWhere(
            new Brackets((qb) => {
                if (filterdate != '') {
                    const dataDate = filterdate.split(' to ');
                    if (dataDate.length == 2) {
                        qb.where(`employee.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`);
                    }
                    if (dataDate.length == 1) {
                        qb.where(`employee(users.created_at as date) = '${dataDate[0]}'`);
                    }
                }
            })
        )
        .orderBy(`employee.${order}`, 'DESC')
        .limit(limit)
        .offset((page - 1) * limit);
       
        return data.getRawMany();
    }

    async getDetail(id: string): Promise<any> {
        return this.emplyeeRepo.createQueryBuilder('employee')
        .select(['employee.*', 'job_title.job_name as job_name', 'department.department_name as department_name'])
        .innerJoin('job_title', 'job_title', 'employee.job_title = job_title.id')
        .leftJoin('department', 'department', 'employee.department = department.id')
        .where('employee.deleted IS NULL')
        .andWhere('employee.id = :id', { id: id })
        .getRawOne();
    }

    async countAll(search: any): Promise<any> {
        return this.emplyeeRepo.createQueryBuilder('employee')
        .select(['employee.*'])
        .where('employee.deleted IS NULL')
        .andWhere(
            new Brackets((qb) => {
                qb.where(`employee.name LIKE '%${search}%'`)
                .orWhere(`employee.employee_code LIKE '%${search}%'`)
                .orWhere(`employee.address LIKE '%${search}%'`);
            })
        )
        .getCount();        
    }

    async save(params) : Promise<any>{
        const result :any= {
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
            result.data = await params.id != '' && params.id != null ? this.emplyeeRepo.update(params.id, params) : this.emplyeeRepo.save(params);
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
            result.data = await this.emplyeeRepo.update(id, { deleted: new Date() });
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
            result.data = await this.emplyeeRepo.update({ id: In(id) }, { deleted: new Date() });
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
        let no = 'EMP-' + year + month+"-";
        
        const data = await this.emplyeeRepo.createQueryBuilder('employee')
        .select(['employee.*'])
        .where('employee.deleted IS NULL')
        .andWhere(`employee.employee_code LIKE '${no}%'`)
        .orderBy({ created_at: 'DESC' })
        .limit(1)
        .getRawOne();
        let sequence: string = '1';
        if (data) {
            sequence = data['employee_code'].replace(no, '');
            sequence = String(Number(sequence) + 1);
        }

        sequence = Core.digitCount(4, sequence);
        no += sequence;
        
        return no;
    }
}
