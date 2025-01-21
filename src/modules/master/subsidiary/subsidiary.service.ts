import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subsidiary } from 'src/repository/master/subsidiary.entity';
import { Brackets, DataSource, In, Repository } from 'typeorm';

@Injectable()
export class SubsidiaryService {
    constructor(
        @InjectRepository(Subsidiary)
        private ptRepo: Repository<Subsidiary>,
        private dataSource: DataSource,
      ) {}
    
      async getAll(): Promise<any> {
        return this.ptRepo
          .createQueryBuilder('subsidiary')
          .select(['subsidiary.*'])
          .where('subsidiary.deleted IS NULL')
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
          .createQueryBuilder('subsidiary')
          .select(['subsidiary.*'])
          .where('subsidiary.deleted IS NULL')
          .andWhere(
            new Brackets((qb) => {
              qb.where(`subsidiary.type LIKE '%${search}%'`).orWhere(
                `subsidiary.remarks LIKE '%${search}%'`,
              );
            }),
          )
          .andWhere(
            new Brackets((qb) => {
              if (filterdate != '') {
                const dataDate = filterdate.split(' to ');
                if (dataDate.length == 2) {
                  qb.where(
                    `subsidiary.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
                  );
                }
                if (dataDate.length == 1) {
                  qb.where(
                    `cast(subsidiary.created_at as date) = '${dataDate[0]}'`,
                  );
                }
              }
            }),
          )
          .orderBy(`subsidiary.${order}`, 'DESC')
          .limit(limit)
          .offset((page - 1) * limit);
    
        return data.getRawMany();
      }
    
      async getDetail(id: string): Promise<any> {
        return this.ptRepo
          .createQueryBuilder('subsidiary')
          .select(['subsidiary.*'])
          .where('subsidiary.deleted IS NULL')
          .andWhere('subsidiary.id = :id', { id: id })
          .getRawOne();
      }
    
      async countAll(search: any): Promise<any> {
        return this.ptRepo
          .createQueryBuilder('subsidiary')
          .select(['subsidiary.*'])
          .where('subsidiary.deleted IS NULL')
          .andWhere(
            new Brackets((qb) => {
              qb.where(`subsidiary.type LIKE '%${search}%'`).orWhere(
                `subsidiary.remarks LIKE '%${search}%'`,
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
              ? await queryRunner.manager.update(Subsidiary, paramsData.id, params)
              : await queryRunner.manager.save(Subsidiary, params);
    
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
