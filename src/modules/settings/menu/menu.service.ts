import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/repository/master/menu.entity';
import Core from 'src/utils/core';
import { Brackets, DataSource, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private dataSource: DataSource,
  ) {}

  async getAll(): Promise<any> {
    return this.menuRepo
      .createQueryBuilder('menu')
      .select(['menu.*'])
      .where('menu.deleted IS NULL')
      .getRawMany();
  }
 
  async getAllMenuRouting(): Promise<any> {
    return this.menuRepo
      .createQueryBuilder('menu')
      .select(['menu.*'])
      .where('menu.deleted IS NULL')
      .andWhere('menu.routing = 1')
      .getRawMany();
  }

  async getParent(): Promise<any> {
    return this.menuRepo
      .createQueryBuilder('menu')
      .select(['menu.*'])
      .where(
        new Brackets((qb) => {
          qb.where('menu.parent IS NULL').orWhere("menu.parent = ''");
        }),
      )
      .andWhere("menu.path = '/'")
      .andWhere('menu.deleted IS NULL')
      .getRawMany();
  }

  async get(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
  ): Promise<any[]> {
    const data = this.menuRepo
      .createQueryBuilder('menu')
      .select(['menu.*'])
      .where('menu.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`menu.name LIKE '%${search}%'`)
            .orWhere(`menu.menu_code LIKE '%${search}%'`)
            .orWhere(`menu.path LIKE '%${search}%'`);
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `menu.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(`cast(menu.created_at as date) = '${dataDate[0]}'`);
            }
          }
        }),
      )
      .orderBy(`menu.${order}`, 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    return data.getRawMany();
  }

  async getDetail(id: string): Promise<any> {
    return this.menuRepo
      .createQueryBuilder('menu')
      .select([
        'menu.*',
        'parent.name as parent_name',
        'parent.menu_code as parent_code',
      ])
      .leftJoin('menu', 'parent', 'menu.parent = parent.menu_code')
      .where('menu.deleted IS NULL')
      .andWhere('menu.id = :id', { id: id })
      .getRawOne();
  }

  async countAll(search: any): Promise<any> {
    return this.menuRepo
      .createQueryBuilder('menu')
      .select(['menu.*'])
      .where('menu.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`menu.name LIKE '%${search}%'`)
            .orWhere(`menu.menu_code LIKE '%${search}%'`)
            .orWhere(`menu.path LIKE '%${search}%'`);
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
      const menus = await this.menuRepo.find({
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
          ? await queryRunner.manager.update(Menu, paramsData.id, params)
          : await queryRunner.manager.save(Menu, params);

      if (insertOrUpdate == 'insert') {
        await queryRunner.manager.update(
          Menu,
          {
            name: params.name,
          },
          {
            id: menus[0].id + 1,
          },
        );

        result.data.id = menus[0].id + 1;
      }

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
      result.data = await this.menuRepo.update(id, { deleted: new Date() });
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
      result.data = await this.menuRepo.update(
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
    let no = 'MN-' + year + month + '-';

    const data = await this.menuRepo
      .createQueryBuilder('menu')
      .select(['menu.*'])
      .where('menu.deleted IS NULL')
      .andWhere(`menu.menu_code LIKE '${no}%'`)
      .orderBy({ created_at: 'DESC' })
      .limit(1)
      .getRawOne();
    let sequence: string = '1';
    if (data) {
      sequence = data['menu_code'].replace(no, '');
      sequence = String(Number(sequence) + 1);
    }

    sequence = Core.digitCount(4, sequence);
    no += sequence;

    return no;
  }
}
