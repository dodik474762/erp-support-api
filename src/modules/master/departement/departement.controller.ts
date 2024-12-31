import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DepartementService } from './departement.service';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/master/department')
export class DepartementController {
  constructor(private services: DepartementService) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Departement',
    };
  }

  @Get('/getAll')
  async getAll(): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.services.getAll();
    result.data = data;
    return result;
  }

  @Get('/getParent')
  async getParent(): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.services.getParent();
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
        ? 0
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
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.services.getDetail(id);
    result.data = data;
    return result;
  }

  @Post('/submit')
  async submit(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('remarks') remarks: string,
  ): Promise<any> {
    const data: any = {
      id: id,
      department_name: name,
      remarks: remarks,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (id == '') {
      data.code = await this.services.generateCode();
    }

    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
    };
    try {
      result = await this.services.save(data);
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
}