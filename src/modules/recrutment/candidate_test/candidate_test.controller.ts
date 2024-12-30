import { Body, Controller, Get, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CandidateTestService } from './candidate_test.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JobTestService } from 'src/modules/scheduling/job_test/job_test.service';

@Controller('/api/recrutment/candidate-test')
export class CandidateTestController {
  constructor(private services: CandidateTestService, private jobServices: JobTestService) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Rekrutmen Candidate',
    };
  }

  @Get('/get-all')
  async getAll(
    @Query('candidate') candidate: string,
    @Query('job') job: string,
    @Query('job_test_schedule') job_test_schedule: string,
  ): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
      overdue: {},
    };

    const data = await this.services.getAll(candidate, job, job_test_schedule);
    const overdue = await this.services.getOverdue(job, job_test_schedule);
    result.data = data;
    result.overdue = overdue;
    return result;
  }

  @Get('/getDetailJob')
  async getDetailJob(
      @Query('id') id: string
  ): Promise<any>{
      const result = {
          statusCode : 200,
          is_valid: true,
          data: [],
      };

      const data = await this.jobServices.getDetail(id);
      result.data = data;
      return result;
  }

  @UseInterceptors(
    FileInterceptor('fileImage', {
      storage: diskStorage({
        destination:
          'public/img/recrutment/candidate/' +
          new Date().getFullYear() +
          '-' +
          new Date().getMonth(),
        filename: (req, file, cb) => {
          const extension = extname(file.originalname);
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `candidate-${randomName}${extension}`);
        },
      }),
    }),
  )
  @Post('/save-candidate')
  async saveCandidate(
    @Body('data') data: any,
    @UploadedFile() fileImage: Express.Multer.File,
  ): Promise<any> {
    const params = JSON.parse(data);
    
    const datas: any = {
      id: params.id,
      nik: params.nik,
      nama_lengkap: params.nama_lengkap,
      alamat: params.alamat,
      email: params.email,
      contact: params.contact,
      gender: params.gender,
      date_born: params.date_born,
      place_born: params.place_born,
      last_study: params.last_study,
      last_study_remarks: params.last_study_remarks,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
      files: fileImage,
    };

    try {
      result = await this.services.saveCandidate(
        datas,
        params.job_id,
        params.job_test_schedule_id,
        fileImage
      );
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  @Post('/submit-sub-test')
  async saveSubTestCandidate(
    @Body('id') id: string,
    @Body('candidate_test') candidate_test: string,
    @Body('job_schedule') job_schedule: string,
    @Body('job') job: string,
    @Body('start_date') start_date: string,
    @Body('candidate') candidate: string,
    @Body('answers') answers: any[],
  ): Promise<any> {
    const data: any = {
      id: id,
      candidate_test: candidate_test,
      candidate: candidate,
      job_schedule: job_schedule,
      job: job,
      start_date: start_date,
      created_at: new Date(),
      updated_at: new Date(),
      answers: answers,
    };

    const result: any = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
      data: data,
    };
    try {
      /*harus ada pengecekan bahwa sub test sudah selesai semua dan all header test sudah ada semua */
      const candidates = await this.services.getDetailCandidate(data);      
      data.candidates = candidates;
      const results = await this.services.submitSubTest(data);

      if (results.is_valid == true) {
        await this.updateTestCandidate(data);
      }
      result.data = results;
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  async updateTestCandidate(data: any) : Promise<any> {
    const results : any = {};
    const testSubs = await this.services.getTestSubsCandidate(data);
    const totalSubTest = testSubs.length;
    const testSubComplete = testSubs.filter(
      (item: any) => item.status == 'COMPLETE',
    );

    if (testSubComplete.length == totalSubTest) {
      const updateStatusTest = await this.services.updateStatusTest(data);
      results.test_status = updateStatusTest;
    }
    /*UPATE STATUS SUB TEST */

    /*UPATE JOB STEP CANDIDATE */
    const test = await this.services.getTestCandidate(data);
    const totalTest = test.length;
    const testComplete = test.filter(
      (item: any) => item.status == 'COMPLETE',
    );

    if (testComplete.length == totalTest) {
      const candidateJobStep =
        await this.services.saveCandidateJobStep(data);
      results.candidate_job_step = candidateJobStep;
    }
    /*UPATE JOB STEP CANDIDATE */
    return results;
  }
  
  @Post('/submit-sub-test-describe')
  async saveSubTestDescribeCandidate(
    @Body('id') id: string,
    @Body('candidate_test') candidate_test: string,
    @Body('job_schedule') job_schedule: string,
    @Body('candidate_test_sub') candidate_test_sub: string,
    @Body('job') job: string,
    @Body('start_date') start_date: string,
    @Body('candidate') candidate: string,
    @Body('answers') answers: any[],
  ): Promise<any> {
    const data: any = {
      id: id,
      candidate_test: candidate_test,
      candidate: candidate,
      job_schedule: job_schedule,
      candidate_test_sub: candidate_test_sub,
      job: job,
      start_date: start_date,
      created_at: new Date(),
      updated_at: new Date(),
      answers: answers,
    };

    const result: any = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
      data: data,
    };
    try {
      /*harus ada pengecekan bahwa sub test sudah selesai semua dan all header test sudah ada semua */
      const candidates = await this.services.getDetailCandidate(data);
      data.candidates = candidates;
      const results = await this.services.submitSubTestDescribe(data);

      if (results.is_valid == true) {
        await this.updateTestCandidate(data);
      }
      result.data = results;
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  @Post('/submit-sub-test-creplin')
  async saveSubTestCreplinCandidate(
    @Body('id') id: string,
    @Body('candidate_test') candidate_test: string,
    @Body('job_schedule') job_schedule: string,
    @Body('candidate_test_sub') candidate_test_sub: string,
    @Body('job') job: string,
    @Body('start_date') start_date: string,
    @Body('candidate') candidate: string,
    @Body('answers') answers: any[],
  ): Promise<any> {
    const data: any = {
      id: id,
      candidate_test: candidate_test,
      candidate: candidate,
      job_schedule: job_schedule,
      candidate_test_sub: candidate_test_sub,
      job: job,
      start_date: start_date,
      created_at: new Date(),
      updated_at: new Date(),
      answers: answers,
    };

    const result: any = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
      data: data,
    };
    try {
      /*harus ada pengecekan bahwa sub test sudah selesai semua dan all header test sudah ada semua */
      const candidates = await this.services.getDetailCandidate(data);
      data.candidates = candidates;
      const results = await this.services.submitSubTestCreplin(data);

      if (results.is_valid == true) {
        await this.updateTestCandidate(data);
      }
      result.data = results;
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }
  
  @Post('/submit-sub-test-picture')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination:
          'public/img/candidate-test/pictures/' +
          new Date().getFullYear() +
          '-' +
          new Date().getMonth(),
        filename: (req, file, cb) => {
          const extension = extname(file.originalname);
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `fileImage-${randomName}${extension}`);
        },
      }),
    }),
  )
  async saveSubTestPictureCandidate(
    @Body('data') data: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    const datas: any = {
      data: JSON.parse(data),
      files: files,
    };

    let result: any = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
      data: datas,
    };
    try {
      result = await this.services.savePictCandidateSubTest(datas);
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  @Get('/get-sub-test')
  async getSubTest(
    @Query('test') test: string,
    @Query('candidate') candidate: string,
    @Query('candidate_test') candidate_test: string,
  ): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
      introduction: [],
    };

    const dataIntro = await this.services.getSubTestIntroduction(
      candidate,
      test,
    );
    const data = await this.services.getSubTest(
      candidate,
      test,
      candidate_test,
    );
    result.data = data;
    result.introduction = dataIntro;
    return result;
  }

  @Get('/get-test')
  async getTest(
    @Query('test') test: string,
    @Query('candidate_test') candidate_test: string,
    @Query('candidate_test_sub') candidate_test_sub: string,
    @Query('test_sub') test_sub: string,
  ): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
      introduction: [],
    };

    const dataIntro = await this.services.getSubTestIntroductionId(test_sub);
    const data = await this.services.getSubTestById(candidate_test_sub);
    result.data = data;
    result.introduction = dataIntro;
    return result;
  }
 
  @Get('/get-test-describe')
  async getTestDescribe(
    @Query('test') test: string,
    @Query('candidate_test') candidate_test: string,
    @Query('candidate_test_sub') candidate_test_sub: string,
    @Query('test_sub') test_sub: string,
  ): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      test_sub: test_sub,
      data: [],
      introduction: [],
    };

    const data = await this.services.getSubTestDescribeById(candidate_test_sub);
    result.data = data;
    return result;
  }
  
  @Get('/get-test-creplin')
  async getTestCreplin(
    @Query('test') test: string,
    @Query('candidate_test') candidate_test: string,
  ): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      test: test,
      candidate_test: candidate_test,
      data: [],
      introduction: [],
    };

    const data = await this.services.getSubTestCreplin(candidate_test);
    result.data = data;
    return result;
  }
}
