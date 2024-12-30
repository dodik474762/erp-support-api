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
import { TestService } from './test.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/data/test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Test',
    };
  }

  @Get('/getAll')
  async getAll(
    @Query('category') category: string,
  ): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.testService.getAll(category);
    result.data = data;
    return result;
  }
  
  @Get('/get-all-subtest')
  async getAllSubTest(
    @Query('test') test: string
  ): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.testService.getAllSubTest(test);
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
      total_page: isNaN(Number(limit)) ? 0 : await this.testService.countAll(search),
    };

    const data = isNaN(Number(limit)) ? [] : await this.testService.get(
      order,
      search,
      Number(page) + 1,
      Number(limit),
      filterdate,
    );
    result.data = data;
    return result;
  }

  @Get('/get-sub-test')
  async getDataSubTest(
    @Query('order') order: string,
    @Query('search') search: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('filterdate') filterdate: string,
    @Query('test') test: string,
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
      total_page: await this.testService.countAllSubTest(search, test),
    };

    const data = isNaN(Number(limit)) ? [] : await this.testService.getSubTest(
      order,
      search,
      Number(page) + 1,
      Number(limit),
      filterdate,
      test,
    );
    result.data = data;
    return result;
  }

  @Get('/get-introduction')
  async getDataInstroduction(
    @Query('order') order: string,
    @Query('search') search: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('filterdate') filterdate: string,
    @Query('test_sub') test_sub: string,
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
      total_page: await this.testService.countAllIntroduction(search, test_sub),
    };

    const data = isNaN(Number(limit)) ? [] : await this.testService.getIntroduction(
      order,
      search,
      Number(page) + 1,
      Number(limit),
      filterdate,
      test_sub,
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

    const data = await this.testService.getDetail(id);
    result.data = data;
    return result;
  }

  @Get('/get-detail-subtest')
  async getDetailSubTest(@Query('id') id: string): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.testService.getDetailSubTest(id);
    result.data = data;
    return result;
  }

  @Get('/get-detail-introduction')
  async getDetailIntroduction(@Query('id') id: string): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.testService.getDetailIntroduction(id);
    result.data = data;
    return result;
  }

  @Post('/submit')
  async submit(
    @Body('id') id: string,
    @Body('judul') judul: string,
    @Body('remarks') remarks: string,
    @Body('category') category: { value: string; label: string },
  ): Promise<any> {
    const data: any = {
      id: id,
      judul: judul,
      remarks: remarks,
      category: category.value,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
    };
    try {
      result = await this.testService.save(data);
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  @Post('/submit-subtest')
  async submitSubTest(
    @Body('id') id: string,
    @Body('judul') judul: string,
    @Body('remarks') remarks: string,
    @Body('test') test: string,
    @Body('timetest') timetest: string,
  ): Promise<any> {
    const data: any = {
      id: id,
      judul: judul,
      remarks: remarks,
      test: test,
      timetest: timetest,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
    };
    try {
      result = await this.testService.saveSubTest(data);
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  @Post('/submit-introduction')
  @UseInterceptors(
    FileInterceptor('fileImage', {
      storage: diskStorage({
        destination:
          'public/img/test/introduction/' +
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
  async submitIntroduction(
    @Body('data') data: any,
    @UploadedFile() fileImage: Express.Multer.File,
  ): Promise<any> {
    const datas: any = {
      data: JSON.parse(data),
      created_at: new Date(),
      updated_at: new Date(),
    };

    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
      data: datas,
      fileImage: fileImage,
    };
    try {      
      const dataExist =
        datas.data.id == null ||
        datas.data.id == '' ||
        datas.data.id == undefined
          ? await this.testService.getDataIntroduction(datas.data.test_sub) : [];
      if (dataExist.length > 0) {
        result.statusCode = 400;
        result.message = 'Data sudah ada';
      } else {
        result = await this.testService.saveSubIntroduction(datas, fileImage);
      }
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
      result.data = await this.testService.delete(id);
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }

  @Post('/delete-subtest')
  async deleteSubTest(@Body('id') id: string): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: false,
      id: id,
      message: 'Failed',
      data: null,
    };

    try {
      result.data = await this.testService.deleteSubtest(id);
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }

  @Post('/delete-introduction')
  async deleteIntroduction(@Body('id') id: string): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: false,
      id: id,
      message: 'Failed',
      data: null,
    };

    try {
      result.data = await this.testService.deleteIntroduction(id);
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
      result.data = await this.testService.deleteAll(id);
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }

  @Post('/delete-all-subtest')
  async deleteAllSubTest(@Body('id') id: string[]): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: false,
      id: id,
      message: 'Failed',
      data: null,
    };
    try {
      result.data = await this.testService.deleteAllSubTest(id);
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }

  @Post('/delete-all-introduction')
  async deleteAllIntroduction(@Body('id') id: string[]): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: false,
      id: id,
      message: 'Failed',
      data: null,
    };
    try {
      result.data = await this.testService.deleteAllIntroduction(id);
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }
}
