import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import {
  AnyFilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/data/questions')
export class QuestionsController {
  constructor(private questionService: QuestionsService) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Questions',
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
      total_page: isNaN(Number(limit)) ? 0 : await this.questionService.countAll(search),
      total_data: 0,
    };

    const data = isNaN(Number(limit)) ? [] : await this.questionService.get(
      order,
      search,
      Number(page) + 1,
      Number(limit),
      filterdate,
    );
    result.data = data;
    result.total_data = data.length;
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
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination:
          'public/img/test/questions/' +
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
  async submit(
    @Body('data') data: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    const datas = JSON.parse(data);
    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
      data: datas,
      files: files,
    };

    // console.log(result);
    try {
      result = await this.questionService.save(datas, files);
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
