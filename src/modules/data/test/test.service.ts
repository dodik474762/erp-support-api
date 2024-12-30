/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Test } from 'src/repository/rekrutmen/test.entity';
import { TestIntroduction } from 'src/repository/rekrutmen/test_introduction.entity';
import { TestSub } from 'src/repository/rekrutmen/test_sub.entity';
import { Brackets, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private testRepo: Repository<Test>,
    @InjectRepository(TestSub)
    private testSubRepo: Repository<TestSub>,
    @InjectRepository(TestIntroduction)
    private testIntroRepo: Repository<TestIntroduction>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getAll(category: string): Promise<any> {
    if (category) {
      return this.testRepo
        .createQueryBuilder('test')
        .select(['test.*'])
        .where('test.deleted IS NULL')
        .andWhere('test.category = :category', { category: category })
        .getRawMany();
    }

    return this.testRepo
      .createQueryBuilder('test')
      .select(['test.*'])
      .where('test.deleted IS NULL')
      .getRawMany();
  }

  async getAllSubTest(test): Promise<any> {
    return this.testSubRepo
      .createQueryBuilder('test_sub')
      .select(['test_sub.*'])
      .where('test_sub.deleted IS NULL')
      .andWhere('test_sub.test = :test', { test: test })
      .getRawMany();
  }

  async get(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
  ): Promise<any[]> {
    const data = this.testRepo
      .createQueryBuilder('test')
      .select(['test.*', 'dictionary.keterangan as category_name'])
      .innerJoin(
        'dictionary',
        'dictionary',
        'dictionary.term_id = test.category',
      )
      .where('test.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`test.category LIKE '%${search}%'`)
            .orWhere(`test.judul LIKE '%${search}%'`)
            .orWhere(`test.remarks LIKE '%${search}%'`);
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `test.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(`cast(test.created_at as date) = '${dataDate[0]}'`);
            }
          }
        }),
      )
      .orderBy(`test.${order}`, 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    return data.getRawMany();
  }

  async getSubTest(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
    test: string,
  ): Promise<any[]> {
    const data = this.testSubRepo
      .createQueryBuilder('test_sub')
      .select(['test_sub.*', 'dictionary.keterangan as category_name'])
      .innerJoin(
        'dictionary',
        'dictionary',
        'dictionary.term_id = test_sub.category',
      )
      .where('test_sub.deleted IS NULL')
      .andWhere('test_sub.test = :test', { test: test })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`test_sub.category LIKE '%${search}%'`)
            .orWhere(`test_sub.judul LIKE '%${search}%'`)
            .orWhere(`test_sub.remarks LIKE '%${search}%'`);
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `test_sub.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(`cast(test_sub.created_at as date) = '${dataDate[0]}'`);
            }
          }
        }),
      )
      .orderBy(`test_sub.${order}`, 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    return data.getRawMany();
  }

  async getIntroduction(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
    test_sub: string,
  ): Promise<any[]> {
    const data = this.testIntroRepo
      .createQueryBuilder('test_introduction')
      .select([
        'test_introduction.*',
        'dictionary.keterangan as category_name',
        'test_sub.judul as judul',
      ])
      .innerJoin(
        'test_sub',
        'test_sub',
        'test_sub.id = test_introduction.test_sub',
      )
      .innerJoin(
        'dictionary',
        'dictionary',
        'dictionary.term_id = test_sub.category',
      )
      .where('test_introduction.deleted IS NULL')
      .andWhere('test_introduction.test_sub = :test_sub', {
        test_sub: test_sub,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`test_sub.category LIKE '%${search}%'`)
            .orWhere(`test_sub.judul LIKE '%${search}%'`)
            .orWhere(`test_sub.remarks LIKE '%${search}%'`);
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `test_introduction.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(
                `cast(test_introduction.created_at as date) = '${dataDate[0]}'`,
              );
            }
          }
        }),
      )
      .orderBy(`test_introduction.${order}`, 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    return data.getRawMany();
  }

  async getDetail(id: string): Promise<any> {
    return this.testRepo
      .createQueryBuilder('test')
      .select(['test.*', 'dictionary.keterangan as category_name'])
      .innerJoin(
        'dictionary',
        'dictionary',
        'dictionary.term_id = test.category',
      )
      .where('test.deleted IS NULL')
      .andWhere('test.id = :id', { id: id })
      .getRawOne();
  }

  async getDetailSubTest(id: string): Promise<any> {
    return this.testSubRepo
      .createQueryBuilder('test_sub')
      .select(['test_sub.*', 'dictionary.keterangan as category_name'])
      .innerJoin(
        'dictionary',
        'dictionary',
        'dictionary.term_id = test_sub.category',
      )
      .where('test_sub.deleted IS NULL')
      .andWhere('test_sub.id = :id', { id: id })
      .getRawOne();
  }

  async getDetailIntroduction(id: string): Promise<any> {
    return this.testIntroRepo
      .createQueryBuilder('test_introduction')
      .select(['test_introduction.*'])
      .where('test_introduction.deleted IS NULL')
      .andWhere('test_introduction.id = :id', { id: id })
      .getRawOne();
  }

  async countAll(search: any): Promise<any> {
    return this.testRepo
      .createQueryBuilder('test')
      .select(['test.*'])
      .where('test.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`test.judul LIKE '%${search}%'`)
            .orWhere(`test.remarks LIKE '%${search}%'`)
            .orWhere(`test.category LIKE '%${search}%'`);
        }),
      )
      .getCount();
  }

  async countAllSubTest(search: any, test: string): Promise<any> {
    return this.testSubRepo
      .createQueryBuilder('test_sub')
      .select(['test_sub.*'])
      .where('test_sub.deleted IS NULL')
      .andWhere('test_sub.test = :test', { test: test })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`test_sub.judul LIKE '%${search}%'`)
            .orWhere(`test_sub.remarks LIKE '%${search}%'`)
            .orWhere(`test_sub.category LIKE '%${search}%'`);
        }),
      )
      .getCount();
  }

  async countAllIntroduction(search: any, test_sub: string): Promise<any> {
    return this.testIntroRepo
      .createQueryBuilder('test_introduction')
      .select(['test_introduction.*'])
      .innerJoin(
        'test_sub',
        'test_sub',
        'test_sub.id = test_introduction.test_sub',
      )
      .where('test_introduction.deleted IS NULL')
      .andWhere('test_introduction.test_sub = :test_sub', {
        test_sub: test_sub,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`test_sub.judul LIKE '%${search}%'`)
            .orWhere(`test_sub.remarks LIKE '%${search}%'`)
            .orWhere(`test_sub.category LIKE '%${search}%'`);
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
        if (roles.id != '') {
          roles.updated_at = new Date();
        } else {
          roles.id = null;
        }
        result.data =
          (await roles.id) != '' && roles.id != null
            ? this.testRepo.update(roles.id, roles)
            : this.testRepo.save(roles);
        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
      })
      .catch((error) => {
        result.message = String(error);
      });
    return result;
  }

  async saveSubTest(roles): Promise<any> {
    const result: any = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        const test = await this.testRepo.findOne({ where: { id: roles.test } });
        if (roles.id != '') {
          roles.updated_at = new Date();
        } else {
          roles.id = null;
        }
        roles.category = test.category;
        result.data =
          (await roles.id) != '' && roles.id != null
            ? this.testSubRepo.update(roles.id, roles)
            : this.testSubRepo.save(roles);
        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
      })
      .catch((error) => {
        result.message = String(error);
      });
    return result;
  }

  async getDataIntroduction(test_sub): Promise<any> {
    return this.testIntroRepo
      .createQueryBuilder('test_introduction')
      .select(['test_introduction.*'])
      .innerJoin(
        'test_sub',
        'test_sub',
        'test_sub.id = test_introduction.test_sub',
      )
      .where('test_introduction.deleted IS NULL')
      .andWhere('test_introduction.test_sub = :test_sub', {
        test_sub: test_sub,
      })
      .getRawMany();
  }

  async saveSubIntroduction(roles, fileImage): Promise<any> {
    const result: any = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        const testSub = await this.testSubRepo.findOne({
          where: { id: roles.data.test_sub },
        });
        const post: any = {
          id: roles.data.id,
          test_sub: roles.data.test_sub,
          timetest: roles.data.timetest,
          test: testSub.test,
          remarks: roles.data.remarks,
          type: roles.data.type.value,
          created_at: new Date(),
        };
        if (post.id != '') {
          post.updated_at = new Date();
        } else {
          post.id = null;
        }
        if (String(post.type).toLowerCase() == 'image') {
          if (fileImage) {
            post.file = fileImage.filename;
            post.file_path = fileImage.destination.replace('public/', '');
          }
        } else {
          post.file = null;
          post.file_path = null;
        }

        result.data =
          (await post.id) != '' && post.id != null
            ? this.testIntroRepo.update(post.id, post)
            : this.testIntroRepo.save(post);
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
      result.data = await this.testRepo.update(id, { deleted: new Date() });
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }

  async deleteSubtest(id: string): Promise<any> {
    const result = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };
    try {
      result.data = await this.testSubRepo.update(id, { deleted: new Date() });
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }

  async deleteIntroduction(id: string): Promise<any> {
    const result = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };
    try {
      result.data = await this.testIntroRepo.update(id, {
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
      result.data = await this.testRepo.update(
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

  async deleteAllSubTest(id: string[]): Promise<any> {
    const result = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };
    try {
      result.data = await this.testSubRepo.update(
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

  async deleteAllIntroduction(id: string[]): Promise<any> {
    const result = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };
    try {
      result.data = await this.testIntroRepo.update(
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
