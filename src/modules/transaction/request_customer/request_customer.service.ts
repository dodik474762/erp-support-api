import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/repository/transaction/request_customer.entity';
import Core from 'src/utils/core';
import { Brackets, DataSource, In, Repository } from 'typeorm';

@Injectable()
export class RequestCustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepo: Repository<Customer>,
        private dataSource: DataSource,
      ) {}
    
      async getAll(): Promise<any> {
        return this.customerRepo
          .createQueryBuilder('customer')
          .select(['customer.*'])
          .where('customer.deleted IS NULL')
          .getRawMany();
      }
    
      async get(
        order: any,
        search: any,
        page: number,
        limit: number,
        filterdate: string,
      ): Promise<any[]> {
        const data = this.customerRepo
          .createQueryBuilder('customer')
          .select([
            'customer.*',
            'users_next_acc.username as next_acc_name',
            'users_acc.username as acc_by_name',
            'job_title.job_name as jabatan_acc',
          ])
          .leftJoin(
            'users',
            'users_next_acc',
            'users_next_acc.id = customer.next_acc',
          )
          .leftJoin('employee', 'employee', 'employee.nik = users_next_acc.nik')
          .leftJoin('job_title', 'job_title', 'job_title.id = employee.job_title')
          .leftJoin('users', 'users_acc', 'users_acc.id = customer.acc_by')
          .where('customer.deleted IS NULL')
          .andWhere(
            new Brackets((qb) => {
              qb.where(`customer.customer_name LIKE '%${search}%'`)
                .orWhere(`customer.code LIKE '%${search}%'`)
                .orWhere(`customer.customer_erp_id LIKE '%${search}%'`)
                .orWhere(`customer.customer_erp_code LIKE '%${search}%'`)
                .orWhere(`customer.customer_erp_name LIKE '%${search}%'`);
            }),
          )
          .andWhere(
            new Brackets((qb) => {
              if (filterdate != '') {
                const dataDate = filterdate.split(' to ');
                if (dataDate.length == 2) {
                  qb.where(
                    `customer.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
                  );
                }
                if (dataDate.length == 1) {
                  qb.where(
                    `cast(customer.created_at as date) = '${dataDate[0]}'`,
                  );
                }
              }
            }),
          )
          .orderBy(`customer.${order}`, 'DESC')
          .limit(limit)
          .offset((page - 1) * limit);
    
        const result = [];
        const datadb = await data.getRawMany();
        for (let index = 0; index < datadb.length; index++) {
          const element = datadb[index];
          element['status'] = element['status'];
          if (
            element['next_acc'] != null &&
            element['status'] != 'REJECTED' &&
            element['status'] != 'COMPLETED'
          ) {
            element['status'] = 'WAITING ACC ' + element['next_acc_name'];
          }
          result.push(element);
        }
        return result;
      }
    
      async getDetail(id: string): Promise<any> {
        return this.customerRepo
          .createQueryBuilder('customer')
          .select([
            'customer.*',
            'users_next_acc.username as next_acc_name',
            'users_acc.username as acc_by_name',
            'job_title.job_name as jabatan_acc',
            'subsidiary.type as subsidiary_type',
            'customer_category.type as customer_category_name',
          ])
          .innerJoin("customer_category", "customer_category", "customer_category.id = customer.customer_category")
          .leftJoin(
            'users',
            'users_next_acc',
            'users_next_acc.id = customer.next_acc',
          )
          .leftJoin('employee', 'employee', 'employee.nik = users_next_acc.nik')
          .leftJoin('job_title', 'job_title', 'job_title.id = employee.job_title')
          .leftJoin('users', 'users_acc', 'users_acc.id = customer.acc_by')
          .leftJoin('subsidiary', 'subsidiary', 'subsidiary.id = customer.subsidiary')
          .where('customer.deleted IS NULL')
          .andWhere('customer.id = :id', { id: id })
          .getRawOne();
      }
    
      async countAll(search: any): Promise<any> {
        return this.customerRepo
          .createQueryBuilder('customer')
          .select(['customer.*'])
          .where('customer.deleted IS NULL')
          .andWhere(
            new Brackets((qb) => {
                qb.where(`customer.customer_name LIKE '%${search}%'`)
                .orWhere(`customer.code LIKE '%${search}%'`)
                .orWhere(`customer.customer_erp_id LIKE '%${search}%'`)
                .orWhere(`customer.customer_erp_code LIKE '%${search}%'`)
                .orWhere(`customer.customer_erp_name LIKE '%${search}%'`);
            }),
          )
          .getCount();
      }      
    
      async save(params): Promise<any> {
        const result: any = {
          is_valid: false,
          data: null,
          message: 'Failed',
        };
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const paramsData = params;
          const insertOrUpdate = params.id != '' && params.id ? 'update' : 'insert';
    
          if (params.id != '' && params.id) {
            params.updated_at = new Date();
          } else {
            params.id = null;
          }
          result.data =
            insertOrUpdate == 'update'
              ? await queryRunner.manager.update(Customer, paramsData.id, params)
              : await queryRunner.manager.save(Customer, params);    
    
          result.is_valid = true;
          result.message = 'Success';
          result.statusCode = 200;
          await queryRunner.commitTransaction();
        } catch (e) {
          await queryRunner.rollbackTransaction();
          result.message = String(e);
        } finally {
          await queryRunner.release();
        }
    
        return result;
      }
    
      async updateRouting(data: any, id: number) {
        try {
          await this.customerRepo.update(id, {
            next_acc: data.users,
            current_step_acc: null,
          });
        } catch (error) {
          console.log(error);
        }
      }
    
      async delete(id: string): Promise<any> {
        const result = {
          is_valid: false,
          data: null,
          message: 'Failed',
        };
        try {
          result.data = await this.customerRepo.update(id, {
            deleted: new Date(),
          });
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
          message: 'Failed',
        };
        try {
          result.data = await this.customerRepo.update(
            { id: In(id) },
            { deleted: new Date() },
          );
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
        let no = 'CU-' + year + month + '-';
    
        const data = await this.customerRepo
          .createQueryBuilder('customer')
          .select(['customer.*'])
          .where('customer.deleted IS NULL')
          .andWhere(`customer.code LIKE '${no}%'`)
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
