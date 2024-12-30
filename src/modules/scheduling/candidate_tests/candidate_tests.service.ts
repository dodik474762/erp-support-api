/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { CandidateScheduleTest } from 'src/repository/rekrutmen/candidate_schedule_test.entity';
import { CandidateScheduleTestSub } from 'src/repository/rekrutmen/candidate_schedule_test_sub.entity';
import { TestQuestionItem } from 'src/repository/rekrutmen/test_question_item.entity';
import { Brackets, EntityManager, In, IsNull, Repository } from 'typeorm';

@Injectable()
export class CandidateTestsService {
  constructor(
    @InjectRepository(CandidateScheduleTest)
    private candidateTestRepo: Repository<CandidateScheduleTest>,
    @InjectRepository(CandidateScheduleTestSub)
    private candidateTestSubRepo: Repository<CandidateScheduleTestSub>,
    @InjectRepository(TestQuestionItem)
    private testQuestionsItemRepo: Repository<TestQuestionItem>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getAll(): Promise<any> {
    return this.candidateTestRepo
      .createQueryBuilder('candidate_schedule_test')
      .select(['candidate_schedule_test.*'])
      .where('candidate_schedule_test.deleted IS NULL')
      .getRawMany();
  }

  async getAllSubTest(candidate_test: string): Promise<any> {
    return this.candidateTestSubRepo
      .createQueryBuilder('candidate_schedule_test_sub')
      .select(['candidate_schedule_test_sub.*', 'test_sub.judul as judul'])
      .innerJoin(
        "test_sub" ,
        "test_sub" ,
        "test_sub.id = candidate_schedule_test_sub.test_sub" ,
      )
      .where('candidate_schedule_test_sub.deleted IS NULL')
      .andWhere('candidate_schedule_test_sub.candidate_test = :candidate_test', {
        candidate_test: candidate_test,
      })
      .getRawMany();
  }

  async getAllSubTestQuestions(subtest_id: string): Promise<any> {
    return this.testQuestionsItemRepo
      .createQueryBuilder('test_question_item')
      .select(['test_question_item.*'])
      .where('test_question_item.deleted IS NULL')
      .andWhere('test_question_item.test_sub = :subtest_id', {
        subtest_id: subtest_id,
      })
      .getRawMany();
  }

  async get(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
  ): Promise<any[]> {
    const data = this.candidateTestRepo
      .createQueryBuilder('candidate_schedule_test')
      .select([
        'candidate_schedule_test.*',
        'job.nama_job as nama_job',
        'dictionary.keterangan as category_name',
      ])
      .innerJoin('job', 'job', 'job.id = candidate_schedule_test.job')
      .innerJoin('test', 'test', 'test.id = candidate_schedule_test.test')
      .innerJoin(
        'dictionary',
        'dictionary',
        'dictionary.term_id = test.category',
      )
      .where('candidate_schedule_test.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`job.nama_job LIKE '%${search}%'`)
            .orWhere(`candidate_schedule_test.remarks LIKE '%${search}%'`)
            .orWhere(`dictionary.keterangan LIKE '%${search}%'`);
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `candidate_schedule_test.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(
                `cast(candidate_schedule_test.created_at as date) = '${dataDate[0]}'`,
              );
            }
          }
        }),
      )
      .orderBy(`candidate_schedule_test.${order}`, 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

      const db = await data.getRawMany();
      const result = [];
      for (let index = 0; index < db.length; index++) {
        const element = db[index];
        element.date_schedule = moment(element.date_schedule).format('YYYY-MM-DD');
        result.push(element);
      }
    return result;
  }

  async getDetail(id: string): Promise<any> {
    return this.candidateTestRepo
      .createQueryBuilder('candidate_schedule_test')
      .select([
        'candidate_schedule_test.*',
        'job.nama_job as nama_job',
        'dictionary.keterangan as category_name',
        'test.judul as judul',
        'test.category as category',
        'test.remarks as remarks_test',
      ])
      .innerJoin('job', 'job', 'job.id = candidate_schedule_test.job')
      .innerJoin('test', 'test', 'test.id = candidate_schedule_test.test')
      .innerJoin(
        'dictionary',
        'dictionary',
        'dictionary.term_id = test.category',
      )
      .where('candidate_schedule_test.deleted IS NULL')
      .andWhere('candidate_schedule_test.id = :id', { id: id })
      .getRawOne();
  }

  async countAll(search: any): Promise<any> {
    return this.candidateTestRepo
      .createQueryBuilder('candidate_schedule_test')
      .select(['candidate_schedule_test.*'])
      .innerJoin('job', 'job', 'job.id = candidate_schedule_test.job')
      .innerJoin('test', 'test', 'test.id = candidate_schedule_test.test')
      .innerJoin(
        'dictionary',
        'dictionary',
        'dictionary.term_id = test.category',
      )
      .where('candidate_schedule_test.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`job.nama_job LIKE '%${search}%'`)
            .orWhere(`candidate_schedule_test.remarks LIKE '%${search}%'`)
            .orWhere(`dictionary.keterangan LIKE '%${search}%'`);
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
        result.data = [];
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
      result.data = await this.candidateTestRepo.update(id, {
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
      result.data = await this.candidateTestRepo.update(
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
