import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/model/users.model';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';
import { RequestItem } from 'src/repository/transaction/request_item.entity';
import { Brackets, DataSource, Repository } from 'typeorm';

@Injectable()
export class ItemService {
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
    user: UsersModel,
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

    if (user.roles.toLowerCase() != 'superadmin') {
      data.andWhere('users_next_acc.id = :user', { user: user.users_id });
    }

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
      .andWhere('request_item.id = :id', { id: id })
      .getRawOne();
  }

  async countAll(search: any, user: UsersModel): Promise<any> {
    const data = this.requestItemRepo
      .createQueryBuilder('request_item')
      .select(['request_item.*'])
      .innerJoin('users', 'users', 'users.id = request_item.next_acc')
      .where('request_item.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`request_item.item_name LIKE '%${search}%'`)
            .orWhere(`request_item.item_code LIKE '%${search}%'`)
            .orWhere(`request_item.code LIKE '%${search}%'`);
        }),
      );
    if (user.roles.toLowerCase() != 'superadmin') {
      data.andWhere('users.id = :user', { user: user.users_id });
    }

    return data.getCount();
  }

  async save(
    params,
    user: UsersModel,
    routeAccService: RouteAccService,
  ): Promise<any> {
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
      const requestItem = await this.requestItemRepo.findOne({
        where: {
          id: paramsData.id,
        },
      });

      const isLastRouting = await routeAccService.checkIsLastRouting(
        33,
        requestItem.current_step_acc,
      );
      if (isLastRouting) {
        params.status = 'COMPLETED';
      } else {
        params.status = 'APPROVED';
      }
      params.acc_by = user.users_id;
      const updateReqItem = await queryRunner.manager.update(
        RequestItem,
        paramsData.id,
        params,
      );
      // console.log('updateReqItem', updateReqItem);

      const routingAcc = await routeAccService.routingAcc(
        user.users_id,
        33,
        requestItem.current_step_acc,
      );
      if (routingAcc) {
        const routingNextAcc = await routeAccService.routingNextAcc(33, routingAcc.state);
        const routeUpdate = {
          next_acc: routingNextAcc ? routingNextAcc.users : null,
          current_step_acc: routingAcc.state,
        };
        const updateAcc = await queryRunner.manager.update(
          RequestItem,
          paramsData.id,
          routeUpdate,
        );

        const log = await routeAccService.createLogTransaction(
          user.users_id,
          requestItem.code,
          'APPROVE ITEM',
          'APPROVE ITEM',
          'APPROVED',
        );

        result.data = log;
        result.update_item = updateReqItem;
        result.update_acc = updateAcc;
        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
        await queryRunner.commitTransaction();
      } else {
        result.is_valid = false;
        result.statusCode = 400;
        result.message = 'Akun Approval Routing belum di konfigurasi';
        await queryRunner.rollbackTransaction();
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      result.message = String(e);
    } finally {
      await queryRunner.release();
    }

    return result;
  }

  async reject(
    params,
    user: UsersModel,
    routeAccService: RouteAccService,
  ): Promise<any> {
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
      const update = {
        acc_by: user.users_id,
        acc_remarks: params.remarks,
        next_acc: null,
        current_step_acc: null,
        status: 'REJECTED',
      };
      const requestItem = await this.requestItemRepo.findOne({
        where: {
          id: paramsData.id,
        },
      });
      await queryRunner.manager.update(RequestItem, paramsData.id, update);

      await routeAccService.createLogTransaction(
        user.users_id,
        requestItem.code,
        'REJECT ITEM',
        'REJECT ITEM',
        'REJECTED',
      );

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
}
