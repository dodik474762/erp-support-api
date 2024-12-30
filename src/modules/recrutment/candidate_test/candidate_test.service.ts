/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Candidate } from 'src/repository/rekrutmen/candidate.entity';
import { CandidateApplied } from 'src/repository/rekrutmen/candidate_applied.entity';
import { CandidateScheduleTest } from 'src/repository/rekrutmen/candidate_schedule_test.entity';
import { Test } from 'src/repository/rekrutmen/test.entity';
import { EntityManager, In, IsNull, Repository } from 'typeorm';
import { JobScheduleTest } from 'src/repository/rekrutmen/job_schedule_test.entity';
import { JobScheduleTestItem } from 'src/repository/rekrutmen/job_schedule_test_item.entity';
import Core from 'src/utils/core';
import { TestSub } from 'src/repository/rekrutmen/test_sub.entity';
import { CandidateScheduleTestSub } from '../../../repository/rekrutmen/candidate_schedule_test_sub.entity';
import { TestQuestionItem } from 'src/repository/rekrutmen/test_question_item.entity';
import { join } from 'path';
import { CandidateScheduleTestAnswer } from '../../../repository/rekrutmen/candidate_schedule_test_answer.entity';
import { CandidateJobStep } from 'src/repository/rekrutmen/candidate_job_step.entity';
import { CandidateJobLogStep } from 'src/repository/rekrutmen/candidate_job_log_step.entity';
import { CandidateScheduleTestSubPicture } from 'src/repository/rekrutmen/candidate_schedule_test_sub_picture.entity';
import { TestQuestionDescItem } from 'src/repository/master/test_question_desc_item.entity';
import { JobScheduleTestAccept } from 'src/repository/rekrutmen/job_schedule_test_accept.entity';

@Injectable()
export class CandidateTestService {
  constructor(
    @InjectRepository(Test)
    private testRepo: Repository<Test>,
    @InjectRepository(TestSub)
    private testSubRepo: Repository<TestSub>,
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>,
    @InjectRepository(CandidateApplied)
    private candidateAppliedRepo: Repository<CandidateApplied>,
    @InjectRepository(CandidateScheduleTest)
    private candidateScheduleTestRepo: Repository<CandidateScheduleTest>,
    @InjectRepository(CandidateScheduleTestSub)
    private candidateScheduleTestSubRepo: Repository<CandidateScheduleTestSub>,
    @InjectRepository(CandidateScheduleTestAnswer)
    private candidateScheduleTestAnswerRepo: Repository<CandidateScheduleTestAnswer>,
    @InjectRepository(CandidateJobStep)
    private candidateJobStepRepo: Repository<CandidateJobStep>,
    @InjectRepository(CandidateJobLogStep)
    private candidateJobLogStepRepo: Repository<CandidateJobLogStep>,
    @InjectRepository(CandidateScheduleTestSubPicture)
    private candidateScheduleTestSubPictureRepo: Repository<CandidateScheduleTestSubPicture>,
    @InjectRepository(JobScheduleTest)
    private jobScheduleTestRepo: Repository<JobScheduleTest>,
    @InjectRepository(JobScheduleTestItem)
    private jobScheduleTestItemRepo: Repository<JobScheduleTestItem>,
    @InjectRepository(TestQuestionItem)
    private testQuestionItemRepo: Repository<TestQuestionItem>,
    @InjectRepository(TestQuestionDescItem)
    private testQuestionDescItemRepo: Repository<TestQuestionDescItem>,
    @InjectRepository(JobScheduleTestAccept)
    private jobScheduleTestAcceptRepo: Repository<JobScheduleTestAccept>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getAll(candidate: string, job, job_schedule): Promise<any> {
    if (candidate != '') {
      return this.candidateScheduleTestRepo
        .createQueryBuilder('candidate_schedule_test')
        .select([
          'candidate_schedule_test.*',
          'test.judul as judul',
          'test.category as category',
          'test.remarks as remarks',
        ])
        .innerJoin(
          'candidate',
          'candidate',
          'candidate.id = candidate_schedule_test.candidate',
        )
        .innerJoin('test', 'test', 'test.id = candidate_schedule_test.test')
        .where('candidate_schedule_test.deleted IS NULL')
        .andWhere('candidate_schedule_test.candidate = :candidate', {
          candidate: candidate,
        })
        .andWhere('candidate_schedule_test.job = :job', {
          job: job,
        })
        .andWhere('candidate_schedule_test.job_schedule = :job_schedule', {
          job_schedule: job_schedule,
        })
        .orderBy('test.ordering_test', 'ASC')
        .getRawMany();
    }

    return [];
  }

  async getOverdue(job, job_schedule): Promise<any> {
    return this.jobScheduleTestRepo
      .createQueryBuilder('job_schedule_test')
      .select(['job_schedule_test.*'])
      .where('job_schedule_test.deleted IS NULL')
      .andWhere('job_schedule_test.job = :job', {
        job: job,
      })
      .andWhere('job_schedule_test.id = :id', {
        id: job_schedule,
      })
      .getRawOne();
  }

  async getTestSubsCandidate(data: any): Promise<any> {
    return this.candidateScheduleTestSubRepo
      .createQueryBuilder('candidate_schedule_test_sub')
      .select(['candidate_schedule_test_sub.*'])
      .where('candidate_schedule_test_sub.deleted IS NULL')
      .andWhere(
        'candidate_schedule_test_sub.candidate_test = :candidate_test',
        {
          candidate_test: data.candidate_test,
        },
      )
      .getRawMany();
  }

  async getTestCandidate(data: any): Promise<any> {
    return this.candidateScheduleTestRepo
      .createQueryBuilder('candidate_schedule_test')
      .select(['candidate_schedule_test.*'])
      .where('candidate_schedule_test.deleted IS NULL')
      .andWhere('candidate_schedule_test.job_schedule = :job_schedule', {
        job_schedule: data.job_schedule,
      })
      .andWhere('candidate_schedule_test.job = :job', {
        job: data.job,
      })
      .andWhere('candidate_schedule_test.candidate = :candidate', {
        candidate: data.candidate,
      })
      .getRawMany();
  }

  async getDetailCandidate(data: any): Promise<any> {
    return this.candidateRepo
      .createQueryBuilder('candidate')
      .select(['candidate.*', 'candidate_applied.id as id_applied'])
      .innerJoin(
        'candidate_applied',
        'candidate_applied',
        'candidate_applied.candidate = candidate.id',
      )
      .where('candidate.deleted IS NULL')
      .andWhere('candidate.id = :id', {
        id: data.candidate,
      })
      .getRawOne();
  }

  async saveCandidate(
    roles,
    job_id,
    job_test_schedule_id,
    files: any,
  ): Promise<any> {
    const result: any = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        if (roles.id != '') {
          roles.updated_at = new Date();
        } else {
          roles.id = null;
        }
        roles.pas_foto = files.filename;
        roles.path_file = files.destination.replace('public/', '');
        result.data = await this.candidateRepo.save(roles);
        const candidate = result.data.id;

        const jobScheduleTest = await this.jobScheduleTestRepo.findOne({
          where: {
            id: job_test_schedule_id,
          },
        });

        /*insert into candidate applied */
        const candidateApplied = new CandidateApplied();
        candidateApplied.job = job_id;
        candidateApplied.candidate = candidate;
        candidateApplied.nama_candidate = roles.nama_lengkap;
        candidateApplied.date_applied = new Date();
        candidateApplied.remarks = 'Test';
        candidateApplied.created_at = new Date();
        result.applied = await this.candidateAppliedRepo.save(candidateApplied);

        /*insert into candidate test */
        const jobTestAcceptions = await this.jobScheduleTestAcceptRepo.find({
          where: {
            job_schedule_test: job_test_schedule_id,
            deleted: IsNull(),
          },
        });
        const JobScheduleTestItem =
          jobTestAcceptions.length == 0
            ? await this.jobScheduleTestItemRepo.find({
                where: {
                  job_schedule_test: job_test_schedule_id,
                  deleted: IsNull(),
                },
              })
            : await this.jobScheduleTestItemRepo.find({
                where: {
                  job_schedule_test: job_test_schedule_id,
                  deleted: IsNull(),
                  test: In(jobTestAcceptions.map((x) => x.test)),
                },
              });

        const resultTest: any = [];
        for (const element of JobScheduleTestItem) {
          const testdb = await this.testRepo.findOne({
            where: { id: element.test },
          });
          const candidateTest = new CandidateScheduleTest();
          candidateTest.job = job_id;
          candidateTest.candidate = candidate;
          candidateTest.test = element.test;
          candidateTest.job_schedule = job_test_schedule_id;
          candidateTest.nama_candidate = roles.nama_lengkap;
          candidateTest.date_schedule = new Date();
          candidateTest.created_at = new Date();
          candidateTest.remarks = 'Test';
          candidateTest.status = 'ON_GOING';
          candidateTest.poin = 0;
          candidateTest.code = await this.generateCode();
          const test = await this.candidateScheduleTestRepo.save(candidateTest);
          resultTest.push(test);

          const candidateTestId = test.id;
          /*rule ist 6 / 9 sub test */
          let testSub: any = [];
          if (testdb.category == 'TEST_IST') {
            testSub = await this.testSubRepo
              .createQueryBuilder('test_sub')
              .select(['test_sub.*'])
              .where('test_sub.deleted IS NULL')
              .andWhere('test_sub.test = :test', { test: element.test })
              .orderBy('test_sub.id', 'ASC')
              .limit(jobScheduleTest.type_ist_test)
              .getRawMany();
          } else {
            testSub = await this.testSubRepo
              .createQueryBuilder('test_sub')
              .select(['test_sub.*'])
              .where('test_sub.deleted IS NULL')
              .andWhere('test_sub.test = :test', { test: element.test })
              .orderBy('test_sub.id', 'ASC')
              .limit(jobScheduleTest.type_ist_test)
              .getRawMany();
          }
          /*rule ist 6 / 9 sub test */
          for (const sub of testSub) {
            const candidateTestSub = new CandidateScheduleTestSub();
            candidateTestSub.candidate = candidate;
            candidateTestSub.candidate_test = candidateTestId;
            candidateTestSub.test = sub.test;
            candidateTestSub.test_sub = sub.id;
            candidateTestSub.job = job_id;
            candidateTestSub.job_schedule = job_test_schedule_id;
            candidateTestSub.nama_candidate = roles.nama_lengkap;
            candidateTestSub.date_schedule = new Date();
            candidateTestSub.created_at = new Date();
            candidateTestSub.remarks = 'Test';
            candidateTestSub.status = 'ON_GOING';
            candidateTestSub.poin = 0;
            candidateTestSub.code = await this.generateCodeTestSub();
            await this.candidateScheduleTestSubRepo.save(candidateTestSub);
          }
        }

        result.test = resultTest;
        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
      })
      .catch((error) => {
        result.message = String(error);
        result.statusCode = 405;
      });
    return result;
  }

  async generateCode(): Promise<any> {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    let no = 'CANTEST-' + year + month + '-';

    const data = await this.candidateScheduleTestRepo
      .createQueryBuilder('candidate_schedule_test')
      .select(['candidate_schedule_test.*'])
      .where('candidate_schedule_test.deleted IS NULL')
      .andWhere(`candidate_schedule_test.code LIKE '${no}%'`)
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

  async generateCodeTestSub(): Promise<any> {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    let no = 'CANTESTSUB-' + year + month + '-';

    const data = await this.candidateScheduleTestSubRepo
      .createQueryBuilder('candidate_schedule_test_sub')
      .select(['candidate_schedule_test_sub.*'])
      .where('candidate_schedule_test_sub.deleted IS NULL')
      .andWhere(`candidate_schedule_test_sub.code LIKE '${no}%'`)
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

  async getSubTest(
    candidate: string,
    test: string,
    candidate_test: string,
  ): Promise<any> {
    return this.candidateScheduleTestSubRepo
      .createQueryBuilder('candidate_schedule_test_sub')
      .select([
        'candidate_schedule_test_sub.*',
        'test_sub.judul as judul',
        'test_sub.remarks as remarks',
        'test_sub.category as category',
      ])
      .innerJoin(
        'test_sub',
        'test_sub',
        'test_sub.id = candidate_schedule_test_sub.test_sub',
      )
      .where('candidate_schedule_test_sub.deleted IS NULL')
      .andWhere(
        'candidate_schedule_test_sub.candidate_test = :candidate_test',
        { candidate_test: candidate_test },
      )
      .getRawMany();
  }

  async getSubTestById(candidate_test_sub: string): Promise<any> {
    const candidateSubTest: any =
      await this.candidateScheduleTestSubRepo.findOne({
        select: ['id', 'candidate', 'candidate_test', 'test', 'test_sub'],
        where: { id: Number(candidate_test_sub) },
      });

    const questions = await this.testQuestionItemRepo.find({
      relations: ['answers'],
      where: { test_sub: candidateSubTest.test_sub, deleted: IsNull() },
    });

    const result = {
      subtest: candidateSubTest,
      questions: questions,
    };

    return result;
  }

  async getSubTestDescribeById(candidate_test_sub: string): Promise<any> {
    const candidateSubTest: any =
      await this.candidateScheduleTestSubRepo.findOne({
        select: ['id', 'candidate', 'candidate_test', 'test', 'test_sub'],
        where: { id: Number(candidate_test_sub), deleted: IsNull() },
      });

    const questions = await this.testQuestionDescItemRepo.find({
      relations: ['answers'],
      where: { test_sub: candidateSubTest.test_sub, deleted: IsNull() },
    });

    const result = {
      subtest: candidateSubTest,
      questions: questions,
    };

    return result;
  }
  async getSubTestCreplin(candidate_test: string): Promise<any> {
    const candidateSubTest: any = await this.candidateScheduleTestSubRepo.find({
      select: ['id', 'candidate', 'candidate_test', 'test', 'test_sub'],
      where: {
        candidate_test: Number(candidate_test),
        deleted: IsNull(),
        status: 'ON_GOING',
      },
      order: { created_at: 'ASC' },
      take: 1,
    });

    const candidateSubTestDone: any =
      await this.candidateScheduleTestSubRepo.find({
        select: ['id', 'candidate', 'candidate_test', 'test', 'test_sub'],
        where: {
          candidate_test: Number(candidate_test),
          deleted: IsNull(),
          status: 'COMPLETE',
        },
        order: { created_at: 'ASC' },
      });

    const candidateSubTestAll: any =
      await this.candidateScheduleTestSubRepo.find({
        select: ['id', 'candidate', 'candidate_test', 'test', 'test_sub'],
        where: { candidate_test: Number(candidate_test), deleted: IsNull() },
        order: { created_at: 'ASC' },
      });

    const resultQuestions = [];
    for (let i = 0; i < candidateSubTest.length; i++) {
      const element = candidateSubTest[i];
      const questions = await this.testQuestionItemRepo.find({
        relations: ['answers'],
        where: { test_sub: element.test_sub, deleted: IsNull() },
      });
      for (let x = 0; x < questions.length; x++) {
        const elements = questions[x];
        resultQuestions.push({
          subtest: element,
          questions: elements,
        });
      }
    }

    const result = {
      subtest: candidateSubTest,
      questions: resultQuestions,
      totalSoal: candidateSubTestAll.length,
      totalSoalComplete: candidateSubTestDone.length,
    };

    return result;
  }

  async getSubTestIntroduction(candidate: string, test: string): Promise<any> {
    return this.testSubRepo
      .createQueryBuilder('test_sub')
      .select(['test_introduction.*'])
      .innerJoin(
        'test_introduction',
        'test_introduction',
        'test_introduction.test_sub = test_sub.id',
      )
      .where('test_sub.deleted IS NULL')
      .andWhere('test_introduction.deleted IS NULL')
      .andWhere('test_sub.test = :test', { test: test })
      .getRawMany();
  }

  async getSubTestIntroductionId(test_sub: string): Promise<any> {
    return this.testSubRepo
      .createQueryBuilder('test_sub')
      .select([
        'test_introduction.*',
        'test_sub.judul as judul',
        'test_sub.remarks as content',
        'test_sub.timetest as timetest_sub_test',
      ])
      .innerJoin(
        'test_introduction',
        'test_introduction',
        'test_introduction.test_sub = test_sub.id',
      )
      .where('test_sub.deleted IS NULL')
      .andWhere('test_introduction.deleted IS NULL')
      .andWhere('test_sub.id = :test', { test: test_sub })
      .getRawOne();
  }

  async submitSubTest(data: any): Promise<any> {
    const result: any = {
      is_valid: false,
      data: data,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        if (data.answers.length > 0) {
          for (let i = 0; i < data.answers.length; i++) {
            const element = data.answers[i];
            if (element.answers.length > 0) {
              const testQuestionItem: any =
                await this.testQuestionItemRepo.findOne({
                  where: {
                    id: element.questions_item,
                  },
                });
              /*ID JAWABAN HARUS DIIURUTKAN DULU */
              element.anwers = element.answers.sort((n1, n2) => n1 - n2);
              const masterRightAnswersItem = testQuestionItem.right_answer
                .split(',')
                .sort((n1, n2) => n1 - n2);
              testQuestionItem.right_answer = masterRightAnswersItem.join(',');
              /*ID JAWABAN HARUS DIIURUTKAN DULU */

              const poin =
                element.answers.join(',') != testQuestionItem.right_answer
                  ? 0
                  : 1;

              const post = {
                test_sub: testQuestionItem.test_sub,
                test: testQuestionItem.test,
                candidate_schedule_test: data.candidate_test,
                nama_candidate: data.candidates.nama_lengkap,
                answer: element.answers.join(','),
                remarsk: 'answered',
                created_at: new Date(),
                updated_at: new Date(),
                questions_item: testQuestionItem.id,
                candidate_schedule_test_sub: data.id,
                right_answer: testQuestionItem.right_answer,
                poin: poin,
              };
              const candidateAnswer =
                await this.candidateScheduleTestAnswerRepo.save(post);
            }
          }
        }

        const testSub = await this.candidateScheduleTestSubRepo.update(
          { id: data.id },
          {
            updated_at: new Date(),
            status: 'COMPLETE',
            start_date_schedule: data.start_date,
            end_date_schedule: new Date(),
          },
        );

        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
      })
      .catch((error) => {
        result.message = String(error);
        result.statusCode = 405;
      });
    return result;
  }

  async submitSubTestDescribe(data: any): Promise<any> {
    const result: any = {
      is_valid: false,
      data: data,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        if (data.answers.length > 0) {
          for (let i = 0; i < data.answers.length; i++) {
            const element = data.answers[i];
            element.answers = element.answer;
            if (element.answers.length > 0) {
              const testQuestionItem: any =
                await this.testQuestionDescItemRepo.findOne({
                  where: {
                    id: element.questions_item,
                  },
                });

              const post = {
                test_sub: testQuestionItem.test_sub,
                test: testQuestionItem.test,
                candidate_schedule_test: data.candidate_test,
                nama_candidate: data.candidates.nama_lengkap,
                answer: element.answers.join(','),
                remarks: element.questions,
                created_at: new Date(),
                updated_at: new Date(),
                questions_item: testQuestionItem.id,
                candidate_schedule_test_sub: data.candidate_test_sub,
                most: element.most,
                least: element.least,
                poin: 1,
              };

              const candidateAnswer =
                await this.candidateScheduleTestAnswerRepo.save(post);
            }
          }
        }

        const testSub = await this.candidateScheduleTestSubRepo.update(
          { id: data.candidate_test_sub },
          {
            updated_at: new Date(),
            status: 'COMPLETE',
            start_date_schedule: data.start_date,
            end_date_schedule: new Date(),
          },
        );

        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
      })
      .catch((error) => {
        result.message = String(error);
        result.statusCode = 405;
      });
    return result;
  }

  async submitSubTestCreplin(data: any): Promise<any> {
    const result: any = {
      is_valid: false,
      data: data,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        if (data.answers.length > 0) {
          for (let i = 0; i < data.answers.length; i++) {
            const element = data.answers[i];
            element.answers = element.answer;
            if (element.answers.length > 0) {
              const testQuestionItem: any =
                await this.testQuestionItemRepo.findOne({
                  where: {
                    id: element.questions_item,
                  },
                });

              const poin: number =
                element.answers.join(',') != element.right_answer ? 0 : 1;
              const post = {
                test_sub: testQuestionItem.test_sub,
                test: testQuestionItem.test,
                candidate_schedule_test: data.candidate_test,
                nama_candidate: data.candidates.nama_lengkap,
                answer: element.answers.join(','),
                remarks: element.questions,
                created_at: new Date(),
                updated_at: new Date(),
                questions_item: testQuestionItem.id,
                candidate_schedule_test_sub: data.candidate_test_sub,
                poin: poin,
                right_answer: testQuestionItem.right_answer,
              };

              const candidateAnswer =
                await this.candidateScheduleTestAnswerRepo.save(post);
            }
          }
        }

        const testSub = await this.candidateScheduleTestSubRepo.update(
          { id: data.candidate_test_sub },
          {
            updated_at: new Date(),
            status: 'COMPLETE',
            start_date_schedule: data.start_date,
            end_date_schedule: new Date(),
          },
        );

        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
      })
      .catch((error) => {
        result.message = String(error);
        result.statusCode = 405;
      });
    return result;
  }

  async updateStatusTest(data: any): Promise<any> {
    const result: any = {
      is_valid: false,
      data: data,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        const test = await this.candidateScheduleTestRepo.update(
          { id: data.candidate_test },
          {
            updated_at: new Date(),
            status: 'COMPLETE',
          },
        );

        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
      })
      .catch((error) => {
        result.message = String(error);
        result.statusCode = 405;
      });
    return result;
  }

  async saveCandidateJobStep(data: any): Promise<any> {
    const result: any = {
      is_valid: false,
      data: data,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        const post = {
          candidate: data.candidate,
          job: data.job,
          created_at: new Date(),
          updated_at: new Date(),
          step: 'TESTED',
          candidate_applied: data.candidates.id_applied,
        };
        const jobStep = await this.candidateJobStepRepo.save(post);
        const jobLogStep = await this.candidateJobLogStepRepo.save(post);

        result.job_step = jobStep;
        result.job_log_step = jobLogStep;
        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
      })
      .catch((error) => {
        result.message = String(error);
        result.statusCode = 405;
      });
    return result;
  }

  async savePictCandidateSubTest(data: any): Promise<any> {
    const result: any = {
      is_valid: false,
      data: data,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        for (let index = 0; index < data.files.length; index++) {
          const element = data.files[index];
          const post = {
            candidate_schedule_test: data.data.candidate_test,
            candidate_schedule_test_sub: data.data.id,
            file: element.filename,
            path_file: element.destination.replace('public/', ''),
            created_at: new Date(),
            updated_at: new Date(),
          };

          const datas =
            await this.candidateScheduleTestSubPictureRepo.save(post);
        }

        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
      })
      .catch((error) => {
        result.message = String(error);
        result.statusCode = 405;
      });
    return result;
  }
}
