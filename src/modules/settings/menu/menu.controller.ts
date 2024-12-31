import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/settings/menu')
export class MenuController {
  constructor(private menuServices: MenuService) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Menu',
    };
  }

  @Get('/getAll')
  async getAll(): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.menuServices.getAll();
    result.data = data;
    return result;
  }
  
  @Get('/getAllMenuRouting')
  async getAllMenuRouting(): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      data: [],
    };

    const data = await this.menuServices.getAllMenuRouting();
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

    const data = await this.menuServices.getParent();
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
      total_page:isNaN(Number(limit))
      ? 0 : await this.menuServices.countAll(search),
    };

    const data = isNaN(Number(limit))
      ? []
      : await this.menuServices.get(
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

    const data = await this.menuServices.getDetail(id);
    result.data = data;
    return result;
  }

  @Post('/submit')
  async submit(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('icon') icon: string,
    @Body('path') path: string,
    @Body('routing') routing: boolean,
    @Body('parent') parent: { value: string; label: string },
  ): Promise<any> {
    const data: any = {
      id: id,
      name: name,
      icon: icon,
      path: path,
      parent:
        parent 
          ? parent.value == ''
            ? null
            : parent.value
          : null,
      created_at: new Date(),
      updated_at: new Date(),
      routing: routing == true ? 1 : 0
    };

    if (id == '') {
      data.menu_code = await this.menuServices.generateCode();
    }

    let result = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
    };
    try {
      result = await this.menuServices.save(data);
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
      result.data = await this.menuServices.delete(id);
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
      result.data = await this.menuServices.deleteAll(id);
      result.is_valid = true;
      result.message = 'Success';
    } catch (error) {
      result.message = String(error);
    }
    return result;
  }
}
