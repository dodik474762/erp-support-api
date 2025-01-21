import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanningItem } from 'src/repository/master/planning_item.entity';
import { Brackets, DataSource, In, Repository } from 'typeorm';

@Injectable()
export class PlanningItemService {
    constructor(
        @InjectRepository(PlanningItem)
        private ptRepo: Repository<PlanningItem>,
        private dataSource: DataSource,
      ) {}
    
      async getAll(): Promise<any> {
        return this.ptRepo
          .createQueryBuilder('planning_item')
          .select(['planning_item.*'])
          .where('planning_item.deleted IS NULL')
          .getRawMany();
      }
    
      async get(
        order: any,
        search: any,
        page: number,
        limit: number,
        filterdate: string,
      ): Promise<any[]> {
        const data = this.ptRepo
          .createQueryBuilder('planning_item')
          .select(['planning_item.*'])
          .where('planning_item.deleted IS NULL')
          .andWhere(
            new Brackets((qb) => {
              qb.where(`planning_item.type LIKE '%${search}%'`).orWhere(
                `planning_item.remarks LIKE '%${search}%'`,
              );
            }),
          )
          .andWhere(
            new Brackets((qb) => {
              if (filterdate != '') {
                const dataDate = filterdate.split(' to ');
                if (dataDate.length == 2) {
                  qb.where(
                    `planning_item.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
                  );
                }
                if (dataDate.length == 1) {
                  qb.where(
                    `cast(planning_item.created_at as date) = '${dataDate[0]}'`,
                  );
                }
              }
            }),
          )
          .orderBy(`planning_item.${order}`, 'DESC')
          .limit(limit)
          .offset((page - 1) * limit);
    
        return data.getRawMany();
      }
    
      async getDetail(id: string): Promise<any> {
        return this.ptRepo
          .createQueryBuilder('planning_item')
          .select(['planning_item.*'])
          .where('planning_item.deleted IS NULL')
          .andWhere('planning_item.id = :id', { id: id })
          .getRawOne();
      }
    
      async countAll(search: any): Promise<any> {
        return this.ptRepo
          .createQueryBuilder('planning_item')
          .select(['planning_item.*'])
          .where('planning_item.deleted IS NULL')
          .andWhere(
            new Brackets((qb) => {
              qb.where(`planning_item.type LIKE '%${search}%'`).orWhere(
                `planning_item.remarks LIKE '%${search}%'`,
              );
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
          const menus = await this.ptRepo.find({
            order: {
              id: 'DESC',
            },
          });
          const paramsData = params;
          const insertOrUpdate = params.id != '' && params.id ? 'update' : 'insert';
    
          if (params.id != '' && params.id) {
            params.updated_at = new Date();
          } else {
            params.id = menus.length > 0 ? menus[0].id + 1 : null;
          }
          result.data =
            insertOrUpdate == 'update'
              ? await queryRunner.manager.update(PlanningItem, paramsData.id, params)
              : await queryRunner.manager.save(PlanningItem, params);
    
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
          result.data = await this.ptRepo.update(id, { deleted: new Date() });
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
          result.data = await this.ptRepo.update(
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
}
