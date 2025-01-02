/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestItem } from 'src/repository/transaction/request_item.entity';
import Core from 'src/utils/core';
import { Brackets, DataSource, In, Repository } from 'typeorm';

@Injectable()
export class RequestItemService {
  constructor(
    @InjectRepository(RequestItem)
    private requestItemRepo: Repository<RequestItem>,
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
      .select(['request_item.*'])
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

    return data.getRawMany();
  }

  async getDetail(id: string): Promise<any> {
    return this.requestItemRepo
      .createQueryBuilder('request_item')
      .select(['request_item.*'])
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
          ? await queryRunner.manager.update(RequestItem, paramsData.id, params)
          : await queryRunner.manager.save(RequestItem, params);

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
