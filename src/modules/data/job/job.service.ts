/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/repository/rekrutmen/job.entity';
import { Brackets, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getAll(): Promise<any> {
    return this.jobRepo
      .createQueryBuilder('job')
      .select(['job.*'])
      .where('job.deleted IS NULL')
      .getRawMany();
  }

  async get(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
  ): Promise<any[]> {
    const data = this.jobRepo
      .createQueryBuilder('job')
      .select([
        'job.*',
        'company.id as code_company',
        'company.nama as name_company',
      ])
      .leftJoin('company', 'company', 'company.id = job.company')
      .where('job.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`job.nama_job LIKE '%${search}%'`).orWhere(
            `job.remarks LIKE '%${search}%'`,
          );
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `job.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(`cast(job.created_at as date) = '${dataDate[0]}'`);
            }
          }
        }),
      )
      .orderBy(`job.${order}`, 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    return data.getRawMany();
  }

  async getDetail(id: string): Promise<any> {
    return this.jobRepo
      .createQueryBuilder('job')
      .select([
        'job.*',
        'company.id as code_company',
        'company.nama as nama_company',
      ])
      .leftJoin('company', 'company', 'company.id = job.company')
      .where('job.deleted IS NULL')
      .andWhere('job.id = :id', { id: id })
      .getRawOne();
  }

  async countAll(search: any): Promise<any> {
    return this.jobRepo
      .createQueryBuilder('job')
      .select(['job.*'])
      .where('job.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`job.nama_job LIKE '%${search}%'`).orWhere(
            `job.remarks LIKE '%${search}%'`,
          );
        }),
      )
      .getCount();
  }

  async save(roles): Promise<any> {
    const result: any = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        console;
        if (roles.id != '') {
          roles.updated_at = new Date();
        } else {
          roles.id = null;
        }
        result.data =
          (await roles.id) != '' && roles.id != null
            ? this.jobRepo.update(roles.id, roles)
            : this.jobRepo.save(roles);
        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
      })
      .catch((error) => {
        result.message = String(error);
      });
    return result;
  }

  async delete(id: string): Promise<any> {
    const result = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };
    try {
      result.data = await this.jobRepo.update(id, { deleted: new Date() });
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
      result.data = await this.jobRepo.update(
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
