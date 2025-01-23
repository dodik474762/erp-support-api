import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutingHeader } from 'src/repository/master/routing_header.entity';
import { RoutingPermission } from 'src/repository/master/routing_permission.entity';
import { Brackets, DataSource, In, Repository } from 'typeorm';

@Injectable()
export class RoutingService {
  constructor(
    @InjectRepository(RoutingHeader)
    private routingRepo: Repository<RoutingHeader>,
    @InjectRepository(RoutingPermission)
    private routingPermissionRepo: Repository<RoutingPermission>,
    private dataSource: DataSource,
  ) {}

  async getAll(): Promise<any> {
    return this.routingRepo
      .createQueryBuilder('routing_header')
      .select(['routing_header.*'])
      .where('routing_header.deleted IS NULL')
      .getRawMany();
  }

  async getParent(): Promise<any> {
    return this.routingRepo
      .createQueryBuilder('routing_header')
      .select(['routing_header.*'])
      .where(
        new Brackets((qb) => {
          qb.where('routing_header.remarks IS NULL');
        }),
      )
      .andWhere('routing_header.deleted IS NULL')
      .getRawMany();
  }

  async get(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
  ): Promise<any[]> {
    const data = this.routingRepo
      .createQueryBuilder('routing_header')
      .select(['routing_header.*', 'menu.name as menu_name'])
      .innerJoin('menu', 'menu', 'menu.id = routing_header.menu')
      .where('routing_header.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`routing_header.remarks LIKE '%${search}%'`).orWhere(
            `menu.name LIKE '%${search}%'`,
          );
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `routing_header.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(
                `cast(routing_header.created_at as date) = '${dataDate[0]}'`,
              );
            }
          }
        }),
      )
      .orderBy(`routing_header.${order}`, 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    return data.getRawMany();
  }

  async getDetail(id: string): Promise<any> {
    return this.routingRepo
      .createQueryBuilder('routing_header')
      .select(['routing_header.*', 'menu.name as menu_name'])
      .innerJoin('menu', 'menu', 'menu.id = routing_header.menu')
      .where('routing_header.deleted IS NULL')
      .andWhere('routing_header.id = :id', { id: id })
      .getRawOne();
  }
  
  async getDetailItems(id: string): Promise<any> {
    return this.routingPermissionRepo
      .createQueryBuilder('routing_permission')
      .select(['routing_permission.*', 'dictionary.keterangan as type_name', 'users.name as users_name'])
      .innerJoin('dictionary', 'dictionary', 'dictionary.term_id = routing_permission.state')
      .innerJoin('users', 'users', 'users.id = routing_permission.users')
      .where('routing_permission.deleted IS NULL')
      .andWhere('routing_permission.routing_header = :id', { id: id })
      .getRawMany();
  }

  async countAll(search: any): Promise<any> {
    return this.routingRepo
      .createQueryBuilder('routing_header')
      .select(['routing_header.*'])
      .innerJoin('menu', 'menu', 'menu.id = routing_header.menu')
      .where('routing_header.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`routing_header.remarks LIKE '%${search}%'`).orWhere(
            `menu.name LIKE '%${search}%'`,
          );
        }),
      )
      .getCount();
  }

  async save(params, items: any[]): Promise<any> {
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

      let routingHeaderId = 0;
      if (params.id != '' && params.id) {
        params.updated_at = new Date();
        routingHeaderId = params.id;
      } else {
        params.id = null;
      }
      result.data =
        insertOrUpdate == 'update'
          ? await queryRunner.manager.update(
              RoutingHeader,
              paramsData.id,
              params,
            )
          : await queryRunner.manager.save(RoutingHeader, params);

      routingHeaderId = insertOrUpdate == "insert" ? result.data.id : params.id;

      /*insert routing permsiion */
      await queryRunner.manager.delete(RoutingPermission, {
        routing_header: routingHeaderId,
      });
      for (let index = 0; index < items.length; index++) {
        const element = items[index];
        const post = {
          routing_header: routingHeaderId,
          menu: params.menu,
          users: element.users.value,
          prev_state: index == 0 ? null : items[index - 1].type.value,
          state: element.type.value,
          is_active: 1,
          created_at: new Date(),
          updated_at: new Date(),
        };

        await queryRunner.manager.save(RoutingPermission, post);
      }
      /*insert routing permsiion */

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
      result.data = await this.routingRepo.update(id, {
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
      result.data = await this.routingRepo.update(
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
