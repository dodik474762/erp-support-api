/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreplinCategory } from 'src/repository/master/creplin_category.entity';
import { CandidateApplied } from 'src/repository/rekrutmen/candidate_applied.entity';
import { CandidateScheduleTest } from 'src/repository/rekrutmen/candidate_schedule_test.entity';
import { CandidateScheduleTestAnswer } from 'src/repository/rekrutmen/candidate_schedule_test_answer.entity';
import { CandidateScheduleTestSub } from 'src/repository/rekrutmen/candidate_schedule_test_sub.entity';
import { CandidateSummary } from 'src/repository/rekrutmen/candidate_summary.entity';
import { CandidateSummaryDescribe } from 'src/repository/rekrutmen/candidate_summary_desc.entity';
import { NormaTestCfit } from 'src/repository/rekrutmen/norma_test_cfit.entity';
import { TestAnswer } from 'src/repository/rekrutmen/test_answer.entity';
import { TestQuestionItem } from 'src/repository/rekrutmen/test_question_item.entity';
import { Brackets, DataSource, EntityManager, In, IsNull, Repository } from 'typeorm';

@Injectable()
export class SummaryTestCfitService {
  constructor(
    @InjectRepository(CandidateApplied)
    private candidateAppliedRepo: Repository<CandidateApplied>,
    @InjectRepository(CandidateScheduleTestSub)
    private candidateScheduleTestSubRepo: Repository<CandidateScheduleTestSub>,
    @InjectRepository(CandidateScheduleTest)
    private candidateTestRepo: Repository<CandidateScheduleTest>,
    @InjectRepository(TestAnswer)
    private testAnswerRepo: Repository<TestAnswer>,
    @InjectRepository(NormaTestCfit)
    private normaTestCfitRepo: Repository<NormaTestCfit>,
    @InjectRepository(TestQuestionItem)
    private testQuestionItemRepo: Repository<TestQuestionItem>,
    @InjectRepository(CreplinCategory)
    private creplinCategoryRepo: Repository<CreplinCategory>,
    @InjectRepository(CandidateSummary)
    private candidateSummaryRepo: Repository<CandidateSummary>,
    @InjectRepository(CandidateSummaryDescribe)
    private candidateSummaryDescRepo: Repository<CandidateSummaryDescribe>,
    @InjectRepository(CandidateScheduleTestAnswer)
    private candidateSchedulTestAnswerRepo: Repository<CandidateScheduleTestAnswer>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private dataSource: DataSource,
  ) {}

  async getAll(): Promise<any> {
    return this.candidateAppliedRepo
      .createQueryBuilder('candidate_applied')
      .select(['candidate_applied.*', 'job.nama_job as job_name'])
      .innerJoin('job', 'job', 'job.id = candidate_applied.job')
      .where('candidate_applied.deleted IS NULL')
      .getRawMany();
  }

  async get(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
  ): Promise<any[]> {
    const data = this.candidateAppliedRepo
      .createQueryBuilder('candidate_applied')
      .select([
        'candidate_applied.*',
        'candidate.nik as nik',
        'candidate.alamat as alamat',
        'job.nama_job as nama_job',
        'candidate.email as email',
        'candidate.contact as contact',
        'candidate_summary.result as candidate_summary',
      ])
      .innerJoin(
        'candidate',
        'candidate',
        'candidate.id = candidate_applied.candidate',
      )
      .innerJoin('job', 'job', 'job.id = candidate_applied.job')
      .leftJoin('candidate_summary', 'candidate_summary', 'candidate_summary.candidate_applied = candidate_applied.id and candidate_summary.deleted IS NULL') 
      .where('candidate_applied.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`candidate_applied.nama_candidate LIKE '%${search}%'`)
            // .orWhere(`candidate_applied.date_applied LIKE '%${search}%'`)
            .orWhere(`candidate_applied.remarks LIKE '%${search}%'`)
            .orWhere(`job.nama_job LIKE '%${search}%'`);
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `candidate_applied.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(
                `cast(candidate_applied.created_at as date) = '${dataDate[0]}'`,
              );
            }
          }
        }),
      )
      .orderBy(`candidate_applied.${order}`, 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    return data.getRawMany();
  }

  async getDetail(id: string): Promise<any> {
    return this.candidateAppliedRepo
      .createQueryBuilder('candidate_applied')
      .select([
        'candidate_applied.*',
        'candidate.nik as nik',
        'candidate.alamat as alamat',
        'job.nama_job as nama_job',
        'candidate.email as email',
        'candidate.contact as contact',
        'candidate.pas_foto as pas_foto',
        'candidate.path_file as path_file',
        'candidate.gender as gender',
        'candidate.date_born as date_born',
        'candidate.place_born as place_born',
        'candidate.last_study as last_study',
        'candidate.last_study_remarks as last_study_remarks',
      ])
      .innerJoin(
        'candidate',
        'candidate',
        'candidate.id = candidate_applied.candidate',
      )
      .innerJoin('job', 'job', 'job.id = candidate_applied.job')
      .where('candidate_applied.deleted IS NULL')
      .andWhere('candidate_applied.id = :id', { id: id })
      .getRawOne();
  }
 
  async getDetailSeekCandidate(id: string, state: string): Promise<any> {
    let data: any = await this.candidateAppliedRepo
      .createQueryBuilder('candidate_applied')
      .select([
        'candidate_applied.*',
        'candidate.nik as nik',
        'candidate.alamat as alamat',
        'job.nama_job as nama_job',
        'candidate.email as email',
        'candidate.contact as contact',
        'candidate.pas_foto as pas_foto',
        'candidate.path_file as path_file',
        'candidate.gender as gender',
        'candidate.date_born as date_born',
        'candidate.place_born as place_born',
        'candidate.last_study as last_study',
        'candidate.last_study_remarks as last_study_remarks',
      ])
      .innerJoin(
        'candidate',
        'candidate',
        'candidate.id = candidate_applied.candidate',
      )
      .innerJoin('job', 'job', 'job.id = candidate_applied.job')
      .where('candidate_applied.deleted IS NULL');

      if(state == 'prev'){
        data = data.andWhere('candidate_applied.id < :id', { id: id });
      }else{
        data = data.andWhere('candidate_applied.id > :id', { id: id });
      }
      data = data.orderBy('candidate_applied.id', 'DESC');

      data = data.getRawOne();

      return data;
  }

  async getDetailAnswers(id: string[]): Promise<any> {
    return this.testAnswerRepo
      .createQueryBuilder('test_answer')
      .select(['test_answer.*'])
      .where('test_answer.deleted IS NULL')
      .andWhereInIds(id)
      .getRawMany();
  }

  async getDetailCandidateFeedback(id: string): Promise<any> {
    return this.candidateSummaryRepo.findOne({
      where: {
        candidate_applied: Number(id),
        deleted: IsNull(),
      },
      relations: ['candidates_describes'],
    });
  }

  async getListApplicant(data: any): Promise<any> {
    return this.candidateAppliedRepo
      .createQueryBuilder('candidate_applied')
      .select(['candidate_applied.*'])
      .innerJoin(
        'candidate',
        'candidate',
        'candidate.id = candidate_applied.candidate',
      )
      .innerJoin('job', 'job', 'job.id = candidate_applied.job')
      .where('candidate_applied.deleted IS NULL')
      .andWhere('candidate_applied.job = :job', { job: data.job })
      .getRawMany();
  }

  async getSubTestCfit(data: any, test: any, type: string): Promise<any> {
    return this.candidateScheduleTestSubRepo.find({
      where: {
        candidate_test: test.id,
      },
      relations: [
        'subtest',
        'pictures',
        'answers',
        type == 'TEST_CFIT' || type == 'TEST_IST' || type == 'TEST_CREPLIN'
          ? 'answers.questions'
          : 'answers.questions_describes',
      ],
      order: {
        id: 'ASC',
      },
    });
  }

  async getTest(data: any, category: string): Promise<any> {
    return this.candidateTestRepo
      .createQueryBuilder('candidate_schedule_test')
      .select([
        'candidate_schedule_test.*',
        'job_schedule_test.start_date as start_date',
        'job_schedule_test.end_date as end_date',
      ])
      .innerJoin('test', 'test', 'test.id = candidate_schedule_test.test')
      .innerJoin(
        'job_schedule_test',
        'job_schedule_test',
        'job_schedule_test.id = candidate_schedule_test.job_schedule',
      )
      .where('candidate_schedule_test.deleted IS NULL')
      .andWhere('candidate_schedule_test.candidate = :candidate', {
        candidate: data.candidate,
      })
      .andWhere('candidate_schedule_test.job = :job', {
        job: data.job,
      })
      .andWhere('test.category = :category', {
        category: category,
      })
      .getRawOne();
  }

  async getAllTestQuestion(data: any): Promise<any> {
    return this.testQuestionItemRepo.find({
      where: {
        test: data.test,
        deleted: IsNull(),
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async getNormaTestCfit(): Promise<any> {
    return this.normaTestCfitRepo
      .createQueryBuilder('norma_test_cfit')
      .select(['norma_test_cfit.*'])
      .where('norma_test_cfit.deleted IS NULL')
      .getRawMany();
  }

  async getDetailCandidateTest(
    job: string,
    candidate_test: string,
  ): Promise<any> {
    return this.candidateAppliedRepo
      .createQueryBuilder('candidate_applied')
      .select([
        'candidate_applied.*',
        'job_schedule_test.id as job_schedule_test',
      ])
      .innerJoin(
        'candidate',
        'candidate',
        'candidate.id = candidate_applied.candidate',
      )
      .innerJoin('job', 'job', 'job.id = candidate_applied.job')
      .innerJoin(
        'job_schedule_test',
        'job_schedule_test',
        'job_schedule_test.job = candidate_applied.job',
      )
      .where('candidate_applied.deleted IS NULL')
      .where('job_schedule_test.deleted IS NULL')
      .andWhere('candidate_applied.id = :id', { id: candidate_test })
      .andWhere('candidate_applied.job = :job', { job: job })
      .getRawOne();
  }

  async countAll(search: any): Promise<any> {
    return this.candidateAppliedRepo
      .createQueryBuilder('candidate_applied')
      .select(['candidate_applied.*'])
      .where('candidate_applied.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`candidate_applied.nama_candidate LIKE '%${search}%'`)
            // .orWhere(`candidate_applied.date_applied LIKE '%${search}%'`)
            .orWhere(`candidate_applied.remarks LIKE '%${search}%'`);
          // .orWhere(`job.nama_job LIKE '%${search}%'`);
        }),
      )
      .getCount();
  }

  async delete(id: string): Promise<any> {
    const result = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };
    try {
      result.data = await this.candidateAppliedRepo.update(id, {
        deleted: new Date(),
      });
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }

  async cancelSummaryFeedbackCandidate(id: string): Promise<any> {
    const result = {
      is_valid: false,
      data: null,
      message: 'Failed',
      statusCode: 400,
    };
    try {
      const summary = await this.candidateSummaryRepo.findOne({
        where: {
          candidate_applied: Number(id),
          deleted: IsNull(),
        },
      });

      if (summary) {
        result.data = await this.candidateSummaryRepo.update(summary.id, {
          deleted: new Date(),
        });

        this.candidateSummaryDescRepo.update(
          {
            candidate_summary: summary.id,
          },
          {
            deleted: new Date(),
          },
        );
      }
      result.is_valid = true;
      result.message = 'Success';
      result.statusCode = 200;
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }

  async submitRetestCandidate(data: any): Promise<any> {
    const result = {
      is_valid: false,
      data: null,
      message: 'Failed',
      statusCode: 400,
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      result.data = await queryRunner.manager.update(CandidateApplied,
        data.candidate_applied,
        {
          created_at: new Date(),
        },
      );

      await queryRunner.manager.update(CandidateScheduleTest,
        {
          id: data.id,
        },
        {
          created_at: new Date(),
          status: 'ON_GOING',
        },
      );

      // update sub category test
      await queryRunner.manager.update(
        CandidateScheduleTestSub,
        {
          candidate_test: data.id,
        },
        {
          status: 'ON_GOING',
        },
      );
      // update sub category test

      /*delete all test candidate answer */
      await queryRunner.manager.delete(CandidateScheduleTestAnswer,{
        candidate_schedule_test: data.id,
      });
      /*delete all test candidate answer */
      await queryRunner.commitTransaction();
      result.is_valid = true;
      result.message = 'Success';
      result.statusCode = 200;
    } catch (error) {
      await queryRunner.rollbackTransaction();
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
      result.data = await this.candidateAppliedRepo.update(
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

  async generateRumusCreplin(data: any, candidate: any): Promise<any> {
    // const testCreplin = await this.getAllTestQuestion(data);
    const panker = await this.creplinCategoryRepo.find({
      where: {
        deleted: IsNull(),
        term_category: 'CAT_PANKER',
      },
    });

    const tianker = await this.creplinCategoryRepo.find({
      where: {
        deleted: IsNull(),
        term_category: 'CAT_TIANKER',
      },
    });

    const janker = await this.creplinCategoryRepo.find({
      where: {
        deleted: IsNull(),
        term_category: 'CAT_JANKER',
      },
    });

    const hanker = await this.creplinCategoryRepo.find({
      where: {
        deleted: IsNull(),
        term_category: 'CAT_HANKER',
      },
    });

    const dataCreplin = await this.candidateTestRepo
      .createQueryBuilder('candidate_schedule_test')
      .select([
        'candidate_schedule_test.*',
        'job_schedule_test.start_date as start_date',
        'job_schedule_test.end_date as end_date',
        'candidate.last_study as last_study',
      ])
      .innerJoin(
        'candidate',
        'candidate',
        'candidate.id = candidate_schedule_test.candidate',
      )
      .innerJoin('test', 'test', 'test.id = candidate_schedule_test.test')
      .innerJoin(
        'job_schedule_test',
        'job_schedule_test',
        'job_schedule_test.id = candidate_schedule_test.job_schedule',
      )
      .where('candidate_schedule_test.deleted IS NULL')
      .andWhere('candidate_schedule_test.candidate = :candidate', {
        candidate: data.candidate,
      })
      .andWhere('candidate_schedule_test.job = :job', {
        job: data.job,
      })
      .andWhere('test.category = :category', {
        category: 'TEST_CREPLIN',
      })
      .getRawMany();

    const subTestCreplin = await this.candidateScheduleTestSubRepo.find({
      where: {
        candidate_test: In(dataCreplin.map((d) => d.id)),
      },
      relations: [
        'subtest',
        'pictures',
        'answers',
        'answers.questions',
        'answers.questions_describes',
      ],
      order: {
        id: 'ASC',
      },
    });

    const summaryAnswers = [];
    for (let i = 0; i < subTestCreplin.length; i++) {
      const element = subTestCreplin[i];
      const answersRight = [];
      const answersWrong = [];
      if (element.answers.length > 0) {
        const answers = element.answers;
        for (let j = 0; j < answers.length; j++) {
          const answer = answers[j];
          if (answer.poin > 0) {
            answersRight.push(answer);
          } else {
            answersWrong.push(answer);
          }
        }
      }
      const row = i + 1;
      summaryAnswers.push({
        row: row,
        subtest: element.subtest.judul,
        total_benar: answersRight.length,
        total_salah: answersWrong.length,
        right_answers: answersRight,
        wrong_answers: answersWrong,
        nilai_y: answersRight.length,
        nilaix2: row * row,
        nilaixy: row * answersRight.length,
      });
    }

    /*SORTING ANSWERS POIN */
    const sortingAnswers: any = summaryAnswers.sort((a, b) => {
      return a.total_benar - b.total_benar; //ASC
      // return b.total_benar - a.total_benar //DESC
    });
    /*SORTING ANSWERS POIN */

    const jumlahRow = sortingAnswers
      .map((d) => d.row)
      .reduce((a, b) => {
        return a + b;
      }, 0);
    const jumlahY = sortingAnswers
      .map((d) => d.nilai_y)
      .reduce((a, b) => {
        return a + b;
      });

    const jumlahNilaiX2 = sortingAnswers
      .map((d) => d.nilaix2)
      .reduce((a, b) => {
        return a + b;
      });

    const jumlahNilaiXy = sortingAnswers
      .map((d) => d.nilaixy)
      .reduce((a, b) => {
        return a + b;
      });

    const totalErrorAnswer = sortingAnswers
      .map((d) => d.total_salah)
      .reduce((a, b) => {
        return a + b;
      });

    const dataGrouped = [];
    const temp = [];
    for (let index = 0; index < sortingAnswers.length; index++) {
      const element = sortingAnswers[index];
      const totalBenar = element.total_benar;
      if (!temp.includes(totalBenar)) {
        const frekuensiBenar = sortingAnswers.filter(
          (d) => d.total_benar == totalBenar,
        ).length;
        dataGrouped.push({
          row: index + 1,
          total_benar: totalBenar,
          frekuensi: frekuensiBenar,
          benarKaliFrekuensi: totalBenar * frekuensiBenar,
        });
        temp.push(totalBenar);
      }
    }

    if (dataGrouped.length > 0) {
      /*HITUNG KREPLIN A */
      const nilaiMax = dataGrouped[dataGrouped.length - 1].total_benar;
      const nilaiMin = dataGrouped[0].total_benar;
      const nilaiRange = Math.abs(nilaiMax - nilaiMin);

      const jumlahFrekuensi = dataGrouped
        .map((d) => d.frekuensi)
        .reduce((a, b) => a + b, 0);
      const jumlahBenarKaliFrekuensi = dataGrouped
        .map((d) => d.benarKaliFrekuensi)
        .reduce((a, b) => a + b, 0);
      const totalNilaiM = jumlahBenarKaliFrekuensi / jumlahFrekuensi;

      for (let index = 0; index < dataGrouped.length; index++) {
        const element = dataGrouped[index];
        const nilaid = element.total_benar - totalNilaiM;
        const nilaifd = element.frekuensi * nilaid;
        const nilaiFy = element.frekuensi * element.total_benar;
        dataGrouped[index]['nilai_fy'] = nilaiFy;
        dataGrouped[index]['nilai_d'] = nilaid;
        dataGrouped[index]['nilai_fd'] = nilaifd;
      }

      const jumlahNilaiFy = dataGrouped
        .map((d) => d.nilai_fy)
        .reduce((a, b) => a + b, 0);

      // const jumlahNilaiD = dataGrouped
      //   .map((d) => d.nilai_d)
      //   .reduce((a, b) => a + b, 0);

      // const jumlahNilaiFD = dataGrouped
      //   .map((d) => d.nilai_fd)
      //   .reduce((a, b) => a + b, 0);
      /*HITUNG KREPLIN A */

      /*HITUNG KECEPATAN KERJA / PANKER */
      const pankerTotal = jumlahNilaiFy / jumlahFrekuensi;
      /*HITUNG KECEPATAN KERJA / PANKER */

      /*KETELITIAN KERJA / TIANKER */
      const tiankerTotal = totalErrorAnswer + 0;
      /*KETELITIAN KERJA / TIANKER */

      /*KEAJEGAN KERJA / JANKER */
      const jankerTotal = nilaiRange;
      /*KEAJEGAN KERJA / JANKER */

      /*KETAHANAN KERJA (HANKER) */
      const jumlahXPerN = jumlahRow / jumlahFrekuensi;
      const nilaiBAtas = jumlahFrekuensi * jumlahNilaiXy - jumlahRow * jumlahY;
      const nilaiBBawah =
        jumlahFrekuensi * jumlahNilaiX2 - jumlahRow * jumlahRow;
      const totalNilaiBHanker = nilaiBAtas / nilaiBBawah;
      const nilaiAAtas = jumlahY / jumlahFrekuensi;
      const nilaiABawah = totalNilaiBHanker * jumlahXPerN;
      const totalNilaiAHanker = nilaiAAtas - nilaiABawah;
      const nilaiX45 = totalNilaiAHanker + totalNilaiBHanker * jumlahFrekuensi;
      const nilaiX0 = totalNilaiAHanker + totalNilaiBHanker * 0;
      const hankerTotal = nilaiX45 - nilaiX0;
      /*KETAHANAN KERJA (HANKER) */

      /*SUMMARY PANKER */
      const summaryResult: any = {
        panker_total: pankerTotal,
        panker_remarks: '',
        tianker_total: tiankerTotal,
        tianker_remarks: '',
        janker_total: jankerTotal,
        janker_remarks: '',
        hanker_total: hankerTotal,
        hanker_remarks: '',
      };

      for (let index = 0; index < panker.length; index++) {
        const element = panker[index];
        /*HITUNG SESUAI LAST STUDY */
        const poinControl = await this.getControlCreplinStudyPoin(
          element,
          candidate,
        );
        /*HITUNG SESUAI LAST STUDY */

        const kategori = element.category.toLowerCase();
        switch (kategori) {
          case 'kurang sekali':
            if (pankerTotal <= parseFloat(poinControl.poin)) {
              summaryResult['panker_remarks'] = element.category;
            }
            break;
          case 'baik sekali':
            if (pankerTotal > parseFloat(poinControl.poin)) {
              summaryResult['panker_remarks'] = element.category;
            }
            break;
          case 'kurang':
          case 'sedang':
          case 'baik':
            if (
              pankerTotal >= parseFloat(poinControl.poin) &&
              pankerTotal <
                parseFloat(panker[index + 1][poinControl.poinStudyRemark])
            ) {
              summaryResult['panker_remarks'] = element.category;
            }
            break;

          default:
            break;
        }
      }

      for (let index = 0; index < tianker.length; index++) {
        const element = tianker[index];
        /*HITUNG SESUAI LAST STUDY */
        const poinControl = await this.getControlCreplinStudyPoin(
          element,
          candidate,
        );
        /*HITUNG SESUAI LAST STUDY */

        const kategori = element.category.toLowerCase();
        switch (kategori) {
          case 'baik sekali':
            if (tiankerTotal <= parseFloat(poinControl.poin)) {
              summaryResult['tianker_remarks'] = element.category;
            }
            break;
          case 'kurang sekali':
            if (tiankerTotal > parseFloat(poinControl.poin)) {
              summaryResult['tianker_remarks'] = element.category;
            }
            break;
          case 'kurang':
          case 'sedang':
          case 'baik':
            if (
              tiankerTotal >= parseFloat(poinControl.poin) &&
              tiankerTotal <
                parseFloat(panker[index + 1][poinControl.poinStudyRemark])
            ) {
              summaryResult['tianker_remarks'] = element.category;
            }
            break;

          default:
            break;
        }
      }

      for (let index = 0; index < janker.length; index++) {
        const element = janker[index];
        /*HITUNG SESUAI LAST STUDY */
        const poinControl = await this.getControlCreplinStudyPoin(
          element,
          candidate,
        );
        /*HITUNG SESUAI LAST STUDY */

        const kategori = element.category.toLowerCase();
        switch (kategori) {
          case 'baik sekali':
            if (jankerTotal <= parseFloat(poinControl.poin)) {
              summaryResult['janker_remarks'] = element.category;
            }
            break;
          case 'kurang sekali':
            if (jankerTotal > parseFloat(poinControl.poin)) {
              summaryResult['janker_remarks'] = element.category;
            }
            break;
          case 'kurang':
          case 'sedang':
          case 'baik':
            if (
              jankerTotal >= parseFloat(poinControl.poin) &&
              jankerTotal <
                parseFloat(panker[index + 1][poinControl.poinStudyRemark])
            ) {
              summaryResult['janker_remarks'] = element.category;
            }
            break;

          default:
            break;
        }
      }

      for (let index = 0; index < hanker.length; index++) {
        const element = hanker[index];
        /*HITUNG SESUAI LAST STUDY */
        const poinControl = await this.getControlCreplinStudyPoin(
          element,
          candidate,
        );
        /*HITUNG SESUAI LAST STUDY */
        const kategori = element.category.toLowerCase();
        switch (kategori) {
          case 'kurang sekali':
            if (hankerTotal <= parseFloat(poinControl.poin)) {
              summaryResult['hanker_remarks'] = element.category;
            }
            break;
          case 'baik sekali':
            if (hankerTotal > parseFloat(poinControl.poin)) {
              summaryResult['hanker_remarks'] = element.category;
            }
            break;
          case 'kurang':
          case 'sedang':
          case 'baik':
            if (
              hankerTotal >= parseFloat(poinControl.poin) &&
              hankerTotal <
                parseFloat(panker[index + 1][poinControl.poinStudyRemark])
            ) {
              summaryResult['hanker_remarks'] = element.category;
            }
            break;

          default:
            break;
        }
      }

      return {
        summary: summaryResult,
      };
      /*SUMMARY PANKER */
    }

    return {
      summary: {
        panker_remarks: '',
        tianker_remarks: '',
        janker_remarks: '',
        hanker_remarks: '',
        panker_total: '',
        tianker_total: '',
        janker_total: '',
        hanker_total: '',
      },
    };
  }

  async getControlCreplinStudyPoin(item: any, candidate: any): Promise<any> {
    /*HITUNG SESUAI LAST STUDY */
    let poin_s1_ipa: any = item.poin_s1_ipa;
    let poinStudyRemark = 'poin_s1_ipa';
    switch (candidate.last_study) {
      case 'S1 IPA':
        poin_s1_ipa = item.poin_s1_ipa;
        poinStudyRemark = 'poin_s1_ipa';
        break;
      case 'S1 IPS':
        poin_s1_ipa = item.poin_s1_ips;
        poinStudyRemark = 'poin_s1_ips';
        break;
      case 'SMA IPS':
        poin_s1_ipa = item.poin_sma_ips;
        poinStudyRemark = 'poin_sma_ips';
        break;
      case 'SMA IPA':
        poin_s1_ipa = item.poin_sma_ipa;
        poinStudyRemark = 'poin_sma_ipa';
        break;
      default:
        break;
    }
    /*HITUNG SESUAI LAST STUDY */
    return {
      poin: poin_s1_ipa,
      poinStudyRemark: poinStudyRemark,
    };
  }

  async saveSummaryFeedbackCandidate(roles, files: any): Promise<any> {
    const result: any = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        const post: any = {
          id: roles.id,
          remarks: roles.remarks,
          result: roles.result,
          candidate_applied: roles.applied,
        };
        if (post.id != '') {
          post.updated_at = new Date();
        } else {
          post.id = null;
          post.created_at = new Date();
        }
        post.file_test_desc = files.filename;
        post.path_file_test_desc = files.destination.replace('public/', '');
        result.data = await this.candidateSummaryRepo.save(post);
        const candidate = result.data.id;

        /*INSERT CANDIDATE SUMMARY DESCRIBE*/
        const resultTest: any = [];
        for (const element of roles.kepribadian) {
          const candidateTest = new CandidateSummaryDescribe();
          candidateTest.candidate_summary = candidate;
          candidateTest.code = element.id;
          candidateTest.name = element.text;
          candidateTest.remarks = element.remarks;
          candidateTest.created_at = new Date();
          const test = await this.candidateSummaryDescRepo.save(candidateTest);
          resultTest.push(test);
        }
        /*INSERT CANDIDATE SUMMARY DESCRIBE*/

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

  async getAllCategoryCandidate(id: string): Promise<any> {
    const result = {
      is_valid: false,
      data: null,
      message: 'Failed',
      statusCode: 200,
    };
    try {
      const data = await this.candidateAppliedRepo.findOne({
        where: {
          id: Number(id),
        },
      });
      const dataSubTestCandidate = await this.candidateTestRepo.find({
        where: {
          candidate: data.candidate,
          job: data.job,
          deleted: IsNull(),
        },
        relations: ['test_category'],
      });
      result.data = dataSubTestCandidate;
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      console.log('error', error);
      result.message = String(error);
      result.statusCode = 400;
    }
    return result;
  }
}
