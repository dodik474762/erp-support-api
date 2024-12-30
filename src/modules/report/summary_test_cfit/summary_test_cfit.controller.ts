/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SummaryTestCfitService } from './summary_test_cfit.service';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import Core from 'src/utils/core';

@UseGuards(JwtAuthGuard)
@Controller('/api/report/summary-test-cfit')
export class SummaryTestCfitController {
  constructor(private services: SummaryTestCfitService) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Report Summary Test Cfit',
    };
  }

  @Get('/getAll')
  async getAll(@Query('filterdate') filterdate: string): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      filterdate: filterdate,
      data: [],
    };

    const data = await this.services.getAll();
    result.data = data;
    return result;
  }

  @Get('/getData')
  async getData(
    @Query('order') order: string,
    @Query('search') search: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('filterdate') filterdate: string,
  ): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
      filterdate: filterdate,
      order: order,
      search: search,
      page: Number(page) + 1,
      limit: Number(limit),
      total_page: isNaN(Number(limit))
        ? []
        : await this.services.countAll(search),
    };

    const data = isNaN(Number(limit))
      ? []
      : await this.services.get(
          order,
          search,
          Number(page) + 1,
          Number(limit),
          filterdate,
        );
    result.data = data;
    return result;
  }

  @Get('/getDetail')
  async getDetail(@Query('id') id: string): Promise<any> {
    const result: any = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.services.getDetail(id);
    const applicant = await this.services.getListApplicant(data);
    const test_cfit = await this.services.getTest(data, 'TEST_CFIT');
    let cfitSubTest = [];
    if (test_cfit) {
      cfitSubTest = await this.services.getSubTestCfit(
        data,
        test_cfit,
        'TEST_CFIT',
      );
      test_cfit.subtest = cfitSubTest;
    }

    const test_describe = await this.services.getTest(data, 'TEST_CHAR');
    let testDescribeSubTest = [];
    if (typeof test_describe != 'undefined') {
      testDescribeSubTest = await this.services.getSubTestCfit(
        data,
        test_describe,
        'TEST_CHAR',
      );
      test_describe.subtest = testDescribeSubTest;
    }

    const test_ist = await this.services.getTest(data, 'TEST_IST');
    let testIstData = [];
    if (typeof test_ist != 'undefined') {
      testIstData = await this.services.getSubTestCfit(
        data,
        test_ist,
        'TEST_IST',
      );
      test_ist.subtest = testIstData;
    }

    const test_creplin = await this.services.getTest(data, 'TEST_CREPLIN');
    let creplinSubTest = [];
    if (test_creplin) {
      creplinSubTest = await this.services.getSubTestCfit(
        data,
        test_creplin,
        'TEST_CREPLIN',
      );
      test_creplin.subtest = creplinSubTest;

      const summaryCreplin = await this.services.generateRumusCreplin(
        test_creplin,
        data,
      );
      test_creplin.summary = summaryCreplin;
    }

    const normaTestCfit = await this.services.getNormaTestCfit();

    /*candidate feedback hrd */
    const candidateFeedback =
      await this.services.getDetailCandidateFeedback(id);
    /*candidate feedback hrd */
    result.applicant = applicant;
    result.data = data;
    result.candidate_feedback = candidateFeedback;
    result.test_cfit = test_cfit;
    result.test_creplin = test_creplin;
    result.norma_test_cfit = normaTestCfit;
    result.test_describe = test_describe;
    result.test_ist = test_ist;
    return result;
  }

  @Post('/encode-image')
  async getEncodeImage(@Body('file') files: string): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: null,
      type: null,
    };

    const base64str = await Core.base64_encode(files);
    if (base64str != null) {
      result.type = 'data:image/png;base64,';
    }
    result.data = result.type + String(base64str);
    return result;
  }

  @Get('/detail-answer')
  async getDetailAnswers(@Query('id') id: string): Promise<any> {
    const result: any = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const dataId = id.split(',');

    const data = await this.services.getDetailAnswers(dataId);
    result.data = data;
    return result;
  }

  @Get('/get-candidate-test')
  async getDetailCandidateTest(
    @Query('job') job: string,
    @Query('candidate_test') candidate_test: string,
  ): Promise<any> {
    job = job.trim();
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.services.getDetailCandidateTest(
      job,
      candidate_test,
    );
    result.data = data;
    return result;
  }

  @Post('/delete')
  async delete(@Body('id') id: string): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: false,
      id: id,
      message: 'Failed',
      data: null,
    };

    try {
      result.data = await this.services.delete(id);
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }

  @Post('/deleteAll')
  async deleteAll(@Body('id') id: string[]): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: false,
      id: id,
      message: 'Failed',
      data: null,
    };
    try {
      result.data = await this.services.deleteAll(id);
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }

  @UseInterceptors(
    FileInterceptor('fileImage', {
      storage: diskStorage({
        destination:
          'public/img/summary-recrutment/candidate/' +
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
  @Post('/save-feedback-hrd')
  async saveFeedbackHrd(
    @Body('data') data: any,
    @UploadedFile() fileImage: Express.Multer.File,
  ): Promise<any> {
    const params = JSON.parse(data);

    const datas: any = {
      id: params.id,
      remarks: params.remarks,
      result: params.keputusan,
      applied: params.applied,
      kepribadian: params.kepribadian,
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
      result = await this.services.saveSummaryFeedbackCandidate(
        datas,
        fileImage,
      );
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  @Post('/cancel-feedback-hrd')
  async cancelFeedbackHrd(@Body('id') id: any): Promise<any> {
    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
    };

    try {
      result = await this.services.cancelSummaryFeedbackCandidate(id);
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  @Get('/get-all-category-test')
  async getAllCategoryTest(@Query('id') id: string): Promise<any> {
    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
    };

    try {
      result = await this.services.getAllCategoryCandidate(id);
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  @Post('/submit-retest')
  async submitRetest(
    @Body('id') id: string,
    @Body('candidate') candidate: string,
    @Body('job') job: string,
    @Body('candidate_applied') candidate_applied: string,
  ): Promise<any> {
    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
    };

    const data = {
      id: id,
      candidate : candidate,
      job : job,
      candidate_applied : candidate_applied
    };

    try {
      result = await this.services.submitRetestCandidate(data);
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  @Get('/seek-candidate')
  async getSeekCandidate(@Query('id') id: string, @Query('state') state: string): Promise<any> {
    const result: any = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };
    
    const data = await this.services.getDetailSeekCandidate(id, state);
    result.data = data;
    return result;
  }
}
