/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { JobScheduleTest } from 'src/repository/rekrutmen/job_schedule_test.entity';
import { JobScheduleTestAccept } from 'src/repository/rekrutmen/job_schedule_test_accept.entity';
import { JobScheduleTestItem } from 'src/repository/rekrutmen/job_schedule_test_item.entity';
import { Test } from 'src/repository/rekrutmen/test.entity';
import { Brackets, EntityManager, In, IsNull, Repository } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class JobTestService {
  constructor(
    @InjectRepository(JobScheduleTest)
    private jobTestRepo: Repository<JobScheduleTest>,
    @InjectRepository(JobScheduleTestItem)
    private jobScheduleTestItemRepo: Repository<JobScheduleTestItem>,
    @InjectRepository(Test)
    private testRepo: Repository<Test>,
    @InjectRepository(JobScheduleTestAccept)
    private jobScheduleTestAcceptRepo: Repository<JobScheduleTestAccept>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getAll(): Promise<any> {
    return this.jobTestRepo
      .createQueryBuilder('job_schedule_test')
      .select(['job_schedule_test.*'])
      .where('job_schedule_test.deleted IS NULL')
      .getRawMany();
  }

  async get(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
  ): Promise<any[]> {
    const data = this.jobTestRepo
      .createQueryBuilder('job_schedule_test')
      .select(['job_schedule_test.*', 'job.nama_job as nama_job'])
      .innerJoin('job', 'job', 'job.id = job_schedule_test.job')
      .where('job_schedule_test.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`job.nama_job LIKE '%${search}%'`).orWhere(
            `job_schedule_test.remarks LIKE '%${search}%'`,
          );
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `job_schedule_test.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(
                `cast(job_schedule_test.created_at as date) = '${dataDate[0]}'`,
              );
            }
          }
        }),
      )
      .orderBy(`job_schedule_test.${order}`, 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    const result = [];
    const db: any = await data.getRawMany();

    for (let index = 0; index < db.length; index++) {
      const element = db[index];
      element.start_date = moment(element.start_date).format('YYYY-MM-DD HH:mm:ss');
      element.end_date = moment(element.end_date).format('YYYY-MM-DD HH:mm:ss');
      result.push(element);
    }
    return result;
  }

  async getDetail(id: string): Promise<any> {
    return this.jobTestRepo
      .createQueryBuilder('job_schedule_test')
      .select(['job_schedule_test.*', 'job.nama_job as nama_job'])
      .innerJoin('job', 'job', 'job.id = job_schedule_test.job')
      .where('job_schedule_test.deleted IS NULL')
      .andWhere('job_schedule_test.id = :id', { id: id })
      .getRawOne();
  }

  async getListTestCategory(data: any): Promise<any> {
    const dataTest = await this.testRepo
      .createQueryBuilder('test')
      .select(['test.*', 'job_schedule_test_accept.is_active as is_active'])
      .leftJoin(
        'job_schedule_test_accept',
        'job_schedule_test_accept',
        'test.id = job_schedule_test_accept.test',
      )
      .where('job_schedule_test_accept.job_schedule_test = :id', {
        id: data.id,
      })
      .andWhere('job_schedule_test_accept.deleted IS NULL')
      .getRawMany();
    if (dataTest.length > 0) {
      const tests = await this.getTest();
      const datas = [];
      for (let index = 0; index < tests.length; index++) {
        const test = tests[index];
        let is_active = 0;
        for (let index2 = 0; index2 < dataTest.length; index2++) {
          const dataTest2 = dataTest[index2];
          if (test.id == dataTest2.id) {
            is_active = 1;
          }
        }
        datas.push({
          id: test.id,
          judul: test.judul,
          is_active: is_active,
        });
      }
      return datas;
    }

    return await this.getTest();
  }

  async getAllListTestCategory(): Promise<any> {
    const tests = await this.getTest();
    const datas = [];
    for (let index = 0; index < tests.length; index++) {
      const test = tests[index];
      const is_active = 0;
      datas.push({
        id: test.id,
        judul: test.judul,
        is_active: is_active,
      });
    }
    return datas;
  }

  async getTest(): Promise<any> {
    return await this.testRepo.find({
      where: {
        deleted: IsNull(),
      },
      order: {
        ordering_test: 'ASC',
      },
    });
  }

  async countAll(search: any): Promise<any> {
    return this.jobTestRepo
      .createQueryBuilder('job_schedule_test')
      .select(['job_schedule_test.*'])
      .innerJoin('job', 'job', 'job.id = job_schedule_test.job')
      .where('job_schedule_test.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`job.nama_job LIKE '%${search}%'`).orWhere(
            `job_schedule_test.remarks LIKE '%${search}%'`,
          );
        }),
      )
      .getCount();
  }

  async save(roles, item_tests: any[]): Promise<any> {
    const result: any = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        if (roles.id != '' && roles.id != null) {
          roles.updated_at = new Date();
        } else {
          roles.id = null;
        }

        const jobTest =
          roles.id != '' && roles.id != null
            ? await this.jobTestRepo.update(roles.id, roles)
            : await this.jobTestRepo.save(roles);
        // console.log('jobTest', jobTest);

        await this.jobScheduleTestItemRepo.update(
          { job_schedule_test: roles.id != '' ? roles.id : jobTest.id },
          { deleted: new Date() },
        );

        const dataTest = await this.testRepo.find({
          where: {
            deleted: IsNull(),
          },
        });

        for (let index = 0; index < dataTest.length; index++) {
          const element = dataTest[index];
          const postData = {
            job: roles.job,
            test: element.id,
            job_schedule_test: roles.id != '' ? roles.id : jobTest.id,
            created_at: new Date(),
            updated_at: new Date(),
          };

          await this.jobScheduleTestItemRepo.save(postData);
        }

        /*job test acception */
        await this.jobScheduleTestAcceptRepo.update(
          { job_schedule_test: roles.id != '' ? roles.id : jobTest.id },
          { deleted: new Date() },
        );

        for (let index = 0; index < item_tests.length; index++) {
          const element = item_tests[index];
          const postData = {
            job_schedule_test: roles.id != '' ? roles.id : jobTest.id,
            test: element.id,
            judul: element.judul,
            job: roles.job,
            created_at: new Date(),
            updated_at: new Date(),
            is_active: 1,
          };
          await this.jobScheduleTestAcceptRepo.save(postData);
        }
        /*job test acception */
        result.data = jobTest;
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
      result.data = await this.jobTestRepo.update(id, { deleted: new Date() });
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
      result.data = await this.jobTestRepo.update(
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
