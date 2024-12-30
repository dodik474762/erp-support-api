import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CandidateApplied } from 'src/repository/rekrutmen/candidate_applied.entity';
import { Brackets, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(CandidateApplied)
    private candidateAppliedRepo: Repository<CandidateApplied>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getAll(): Promise<any> {
    return this.candidateAppliedRepo
      .createQueryBuilder('candidate_applied')
      .select(['candidate_applied.*'])
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
      ])
      .innerJoin(
        'candidate',
        'candidate',
        'candidate.id = candidate_applied.candidate',
      )
      .innerJoin('job', 'job', 'job.id = candidate_applied.job')
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

  async getDetailCandidateTest(
    job: string,
    candidate_test: string,
  ): Promise<any> {
    return this.candidateAppliedRepo
      .createQueryBuilder('candidate_applied')
      .select(['candidate_applied.*', 'job_schedule_test.id as job_schedule_test'])
      .innerJoin(
        'candidate',
        'candidate',
        'candidate.id = candidate_applied.candidate',
      )
      .innerJoin('job', 'job', 'job.id = candidate_applied.job')
      .innerJoin('job_schedule_test', 'job_schedule_test', 'job_schedule_test.job = candidate_applied.job')
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
}
