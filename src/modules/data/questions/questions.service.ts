/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { TestAnswer } from 'src/repository/rekrutmen/test_answer.entity';
import { TestQuestionItem } from 'src/repository/rekrutmen/test_question_item.entity';
import { Brackets, EntityManager, In, IsNull, Repository } from 'typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(TestQuestionItem)
    private testQuestionItemRepo: Repository<TestQuestionItem>,
    @InjectRepository(TestAnswer)
    private testAnswerRepo: Repository<TestAnswer>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getAll(): Promise<any> {
    return this.testQuestionItemRepo
      .createQueryBuilder('test_question_item')
      .select(['test_question_item.*'])
      .where('test_question_item.deleted IS NULL')
      .getRawMany();
  }

  async get(
    order: any,
    search: any,
    page: number,
    limit: number,
    filterdate: string,
  ): Promise<any[]> {
    const data = this.testQuestionItemRepo
      .createQueryBuilder('test_question_item')
      .select([
        'test_question_item.*',
        'dictionary.keterangan as category_name',
        'test_sub.judul as judul_sub_test',
      ])
      .innerJoin('test', 'test', 'test.id = test_question_item.test')
      .innerJoin(
        'dictionary',
        'dictionary',
        'dictionary.term_id = test.category',
      )
      .innerJoin(
        'test_sub',
        'test_sub',
        'test_sub.id = test_question_item.test_sub',
      )
      .where('test_question_item.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`test_question_item.questions LIKE '%${search}%'`)
            .orWhere(`test_question_item.remarks LIKE '%${search}%'`)
            .orWhere(`test_question_item.questions IS NULL`);
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (filterdate != '') {
            const dataDate = filterdate.split(' to ');
            if (dataDate.length == 2) {
              qb.where(
                `test_question_item.created_at BETWEEN '${dataDate[0]}' AND '${dataDate[1]}'`,
              );
            }
            if (dataDate.length == 1) {
              qb.where(
                `cast(test_question_item.created_at as date) = '${dataDate[0]}'`,
              );
            }
          }
        }),
      )
      .orderBy(`test_question_item.${order}`, 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    return data.getRawMany();
  }

  async getDetail(id: string): Promise<any> {
    return this.testQuestionItemRepo
      .createQueryBuilder('test_question_item')
      .select([
        'test_question_item.*',
        'test.judul as judul',
        'test_sub.judul as sub_judul',
      ])
      .innerJoin('test', 'test', 'test.id = test_question_item.test')
      .innerJoin(
        'test_sub',
        'test_sub',
        'test_sub.id = test_question_item.test_sub',
      )
      .where('test_question_item.deleted IS NULL')
      .andWhere('test_question_item.id = :id', { id: id })
      .getRawOne();
  }

  async getListAnswer(questions: string): Promise<any> {
    return this.testAnswerRepo
      .createQueryBuilder('test_answer')
      .select(['test_answer.*'])
      .where('test_answer.deleted IS NULL')
      .andWhere('test_answer.test_question = :test_question', {
        test_question: questions,
      })
      .getRawMany();
  }

  async countAll(search: any): Promise<any> {
    return this.testQuestionItemRepo
      .createQueryBuilder('test_question_item')
      .select(['test_question_item.*'])
      .where('test_question_item.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`test_question_item.questions LIKE '%${search}%'`)
            .orWhere(`test_question_item.remarks LIKE '%${search}%'`)
            .orWhere(`test_question_item.questions IS NULL`);
        }),
      )
      .getCount();
  }

  async save(roles, files: any[]): Promise<any> {
    const result: any = {
      is_valid: false,
      data: null,
      message: 'Failed',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.entityManager
      .transaction(async (queryRunner) => {
        /*QUESTIONS */
        const post: any = {
          id: roles.id ?? '',
          test_sub: roles.test_sub.value,
          test: roles.test.value,
          remarks: roles.remarks,
          type: roles.type.value,
          created_at: new Date(),
        };

        let dataAnswer = [];
        if (post.id != '') {
          post.updated_at = new Date();
          dataAnswer = await this.testAnswerRepo.find({
            where: {
              test_question: post.id,
              deleted: IsNull(),
            },
          });

          const idAnswerDeleted = [];
          dataAnswer.forEach((elm) => {
            const answer = roles.answers.find(
              (elmParam) => elmParam.origin_id == elm.id,
            );
            if (!answer) {
              idAnswerDeleted.push(elm.id);
            }
          });

          await this.testAnswerRepo.update(
            { id: In(idAnswerDeleted) },
            { deleted: new Date() },
          );
        } else {
          post.id = null;
        }

        if (String(post.type).toLowerCase() == 'image') {
          post.questions = null;
          if (files.length > 0) {
            if (files[0].fieldname == 'fileImage') {
              post.file_questions = files[0].filename;
              post.path_file = files[0].destination.replace('public/', '');
            }
          }
        } else {
          post.questions = roles.questions;
          post.file_questions = null;
          post.path_file = null;
        }

        let rightAnswerCount = 0;
        roles.answers.forEach((element) => {
          if (element.is_right) {
            rightAnswerCount += 1;
          }
        });
        post.multi_answer = rightAnswerCount > 1 ? 1 : 0;
        /*QUESTIONS */

        const questions =
          (await post.id) != '' && post.id != null
            ? await this.testQuestionItemRepo.update(post.id, post)
            : await this.testQuestionItemRepo.save(post);

        /*ANSWER */
        const answers = [];
        for (let index = 0; index < roles.answers.length; index++) {
          const element = roles.answers[index];
          const postAnswer: any = {
            test_question: post.id != '' ? post.id : questions.id,
            test: post.test,
            test_sub: post.test_sub,
            type: element.type,
            remarks: element.remarks,
            is_right: element.is_right == true ? 1 : 0,
            created_at: new Date(),
            updated_at: new Date(),
          };

          const idParamAnswer = element.id;
          /*SEARCH FILE PARAM */
          if (postAnswer.type.toLowerCase() == 'image') {
            const file = files.find(
              (elmFile) => elmFile.fieldname == 'files-answer-' + idParamAnswer,
            );
            if (file) {
              postAnswer.answer = null;
              postAnswer.file = file.filename;
              postAnswer.file_path = file.destination.replace('public/', '');
            }
          } else {
            postAnswer.answer = element.answer;
          }

          const answer =
            (await element.origin_id) != '' && element.origin_id != null
              ? await this.testAnswerRepo.update(element.origin_id, postAnswer)
              : await this.testAnswerRepo.save(postAnswer);
          answers.push(answer);
          /*SEARCH FILE PARAM */
        }

        const rightAnswer = [];
        answers.forEach((elm) => {
          if (elm.is_right == 1) {
            rightAnswer.push(elm.id);
          }
        });

        const postQuestUpdate = {
          right_answer: rightAnswer.join(','),
        };

        await this.testQuestionItemRepo.update(
          post.id != '' ? post.id : questions.id,
          postQuestUpdate,
        );

        /*ANSWER */
        result.data = questions;
        result.answer = answers;
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
      result.data = await this.testQuestionItemRepo.update(id, {
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
      result.data = await this.testQuestionItemRepo.update(
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
