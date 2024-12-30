import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsDescribeService } from './questions_describe.service';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/data/questions-describe')
// @UseGuards(JwtAuthGuard)
export class QuestionsDescribeController {
  constructor(private questionService: QuestionsDescribeService) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Questions Describe',
    };
  }

  @Get('/getAll')
  async getAll(): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.questionService.getAll();
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
      total_page:isNaN(Number(limit)) ? 0 : await this.questionService.countAll(search),
    };

    const data = isNaN(Number(limit)) ? [] : await this.questionService.get(
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
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.questionService.getDetail(id);
    result.data = data;
    return result;
  }

  @Get('/get-list-answer')
  async getListAnswer(@Query('questions') questions: string): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.questionService.getListAnswer(questions);
    result.data = data;
    return result;
  }

  @Post('/submit')
  async submit(
    @Body('id') id: string,
    @Body('questions') questions: string,
    @Body('remarks') remarks: string,
    @Body('test') test: { value: string; label: string },
    @Body('test_sub') test_sub: { value: string; label: string },
    @Body('answers') answers: any[],
  ): Promise<any> {
    const data = {
      id: id,
      questions: questions,
      remarks: remarks,
      test: test.value,
      test_sub: test_sub.value,
      answers: answers,
      created_at: new Date(),
      updated_at: new Date(),
    };
    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
      data: data
    };

    // console.log(result);
    try {
      result = await this.questionService.save(data);
    } catch (error) {
      result.message = String(error);
    }

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
      result.data = await this.questionService.delete(id);
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
      result.data = await this.questionService.deleteAll(id);
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }
}
