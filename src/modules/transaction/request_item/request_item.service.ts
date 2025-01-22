/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestItem } from 'src/repository/transaction/request_item.entity';
import { RequestItemSalesPrice } from 'src/repository/transaction/request_item_sales_price.entity';
import Core from 'src/utils/core';
import { Brackets, DataSource, In, Repository } from 'typeorm';

@Injectable()
export class RequestItemService {
  constructor(
    @InjectRepository(RequestItem)
    private requestItemRepo: Repository<RequestItem>,
    @InjectRepository(RequestItemSalesPrice)
    private requestItemSalesRepo: Repository<RequestItemSalesPrice>,
    private dataSource: DataSource,
  ) {}

  async getAll(): Promise<any> {
    return this.requestItemRepo
      .createQueryBuilder('request_item')
      .select(['request_item.*'])
      .where('request_item.deleted IS NULL')
      .getRawMany();
  }

  async get(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
  ): Promise<any[]> {
    const data = this.requestItemRepo
      .createQueryBuilder('request_item')
      .select([
        'request_item.*',
        'users_next_acc.username as next_acc_name',
        'users_acc.username as acc_by_name',
        'job_title.job_name as jabatan_acc',
      ])
      .leftJoin(
        'users',
        'users_next_acc',
        'users_next_acc.id = request_item.next_acc',
      )
      .leftJoin('employee', 'employee', 'employee.nik = users_next_acc.nik')
      .leftJoin('job_title', 'job_title', 'job_title.id = employee.job_title')
      .leftJoin('users', 'users_acc', 'users_acc.id = request_item.acc_by')
      .where('request_item.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`request_item.item_name LIKE '%${search}%'`)
            .orWhere(`request_item.item_code LIKE '%${search}%'`)
            .orWhere(`request_item.code LIKE '%${search}%'`);
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `request_item.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(
                `cast(request_item.created_at as date) = '${dataDate[0]}'`,
              );
            }
          }
        }),
      )
      .orderBy(`request_item.${order}`, 'DESC')
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
    return this.requestItemRepo
      .createQueryBuilder('request_item')
      .select([
        'request_item.*',
        'users_next_acc.username as next_acc_name',
        'users_acc.username as acc_by_name',
        'job_title.job_name as jabatan_acc',
        'subsidiary.type as subsidiary_type',
        'product_type.type as product_type_name',
        'unit_p.name as primary_unit_name',
        'unit_ps.name as primary_stock_unit_name',
        'unit_pu.name as primary_purchase_unit_name',
        'unit_psu.name as primary_sale_unit_name',
        'volume_type.type as volume_type_name',
        'group_type.type as group_type_name',
        'cost_category.type as cost_category_name',
        'replanishment_method.type as replanisment_method_name',
        'planning_item.type as planning_item_name',
        'tax_schedule.type as tax_schedule_name',
      ])
      .leftJoin(
        'users',
        'users_next_acc',
        'users_next_acc.id = request_item.next_acc',
      )
      .leftJoin('employee', 'employee', 'employee.nik = users_next_acc.nik')
      .leftJoin('job_title', 'job_title', 'job_title.id = employee.job_title')
      .leftJoin('users', 'users_acc', 'users_acc.id = request_item.acc_by')
      .leftJoin('subsidiary', 'subsidiary', 'subsidiary.id = request_item.subsidiary')
      .leftJoin('product_type', 'product_type', 'product_type.id = request_item.product_type')
      .leftJoin('unit', 'unit_p', 'unit_p.id = request_item.primary_unit')
      .leftJoin('unit', 'unit_ps', 'unit_ps.id = request_item.primary_stock_unit')
      .leftJoin('unit', 'unit_pu', 'unit_pu.id = request_item.primary_purchase_unit')
      .leftJoin('unit', 'unit_psu', 'unit_psu.id = request_item.primary_sale_unit')
      .leftJoin('volume_type', 'volume_type', 'volume_type.id = request_item.volume_type')
      .leftJoin('group_type', 'group_type', 'group_type.id = request_item.group_type')
      .leftJoin('cost_category', 'cost_category', 'cost_category.id = request_item.cost_category')
      .leftJoin('replanishment_method', 'replanishment_method', 'replanishment_method.id = request_item.replanisment_method')
      .leftJoin('planning_item', 'planning_item', 'planning_item.id = request_item.planning_item_category')
      .leftJoin('tax_schedule', 'tax_schedule', 'tax_schedule.id = request_item.tax_schedule')
      .where('request_item.deleted IS NULL')
      .andWhere('request_item.id = :id', { id: id })
      .getRawOne();
  }

  async countAll(search: any): Promise<any> {
    return this.requestItemRepo
      .createQueryBuilder('request_item')
      .select(['request_item.*'])
      .where('request_item.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`request_item.item_name LIKE '%${search}%'`)
            .orWhere(`request_item.item_code LIKE '%${search}%'`)
            .orWhere(`request_item.code LIKE '%${search}%'`);
        }),
      )
      .getCount();
  }
  
  async getDetailSalesItem(id: any): Promise<any> {
    return this.requestItemSalesRepo
      .createQueryBuilder('request_item_sales_price')
      .select(['request_item_sales_price.*', 'price_type.type as type_price_name'])
      .innerJoin('price_type', 'price_type', 'price_type.id = request_item_sales_price.type_price')
      .where('request_item_sales_price.deleted IS NULL')
      .andWhere('request_item_sales_price.request_item = :id', { id: id })
      .getRawMany();
  }

  async save(params, sales_item: any[]): Promise<any> {
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
          ? await queryRunner.manager.update(RequestItem, paramsData.id, params)
          : await queryRunner.manager.save(RequestItem, params);

      /*SALES ITEM */
      if(insertOrUpdate == 'update'){
        await queryRunner.manager.delete(RequestItemSalesPrice, {
          request_item: params.id,
        });
      }
      for (let index = 0; index < sales_item.length; index++) {
        const element = sales_item[index];
        const post = {
          request_item: insertOrUpdate == "update" ? params.id : result.data.id,
          type_price: element.type.value,
          price: element.price,
          created_at: new Date()
        };
        await queryRunner.manager.save(RequestItemSalesPrice, post);
      }
      /*SALES ITEM */

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
      await this.requestItemRepo.update(id, {
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
      result.data = await this.requestItemRepo.update(id, {
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
      result.data = await this.requestItemRepo.update(
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
    let no = 'IT-' + year + month + '-';

    const data = await this.requestItemRepo
      .createQueryBuilder('request_item')
      .select(['request_item.*'])
      .where('request_item.deleted IS NULL')
      .andWhere(`request_item.code LIKE '${no}%'`)
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
