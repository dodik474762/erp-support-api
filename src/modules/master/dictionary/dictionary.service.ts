import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Dictionary } from 'src/repository/master/dictionary.entity';
import { Brackets, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictRepo: Repository<Dictionary>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getAll(context: string): Promise<any> {
    if (context != '') {
      return this.dictRepo
        .createQueryBuilder('dictionary')
        .select(['dictionary.*'])
        .where('dictionary.deleted IS NULL')
        .andWhere('dictionary.context = :context', { context: context })
        .getRawMany();
    }
    return this.dictRepo
      .createQueryBuilder('dictionary')
      .select(['dictionary.*'])
      .where('dictionary.deleted IS NULL')
      .getRawMany();
  }

  async get(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
  ): Promise<any[]> {
    const data = this.dictRepo
      .createQueryBuilder('dictionary')
      .select(['dictionary.*'])
      .where('dictionary.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`dictionary.keterangan LIKE '%${search}%'`).orWhere(
            `dictionary.term_id LIKE '%${search}%'`,
          );
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `dictionary.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(
                `cast(dictionary.created_at as date) = '${dataDate[0]}'`,
              );
            }
          }
        }),
      )
      .orderBy(`dictionary.${order}`, 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    return data.getRawMany();
  }

  async getDetail(id: string): Promise<any> {
    return this.dictRepo
      .createQueryBuilder('dictionary')
      .select(['dictionary.*'])
      .where('dictionary.deleted IS NULL')
      .andWhere('dictionary.id = :id', { id: id })
      .getRawOne();
  }

  async countAll(search: any): Promise<any> {
    return this.dictRepo
      .createQueryBuilder('dictionary')
      .select(['dictionary.*'])
      .where('dictionary.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`dictionary.keterangan LIKE '%${search}%'`).orWhere(
            `dictionary.term_id LIKE '%${search}%'`,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .transaction(async (queryRunner) => {
        console;
        if (roles.id != '') {
          roles.updated_at = new Date();
        } else {
          roles.id = null;
        }
        result.data =
          (await roles.id) != '' && roles.id != null
            ? this.dictRepo.update(roles.id, roles)
            : this.dictRepo.save(roles);
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
      result.data = await this.dictRepo.update(id, { deleted: new Date() });
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
      result.data = await this.dictRepo.update(
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
