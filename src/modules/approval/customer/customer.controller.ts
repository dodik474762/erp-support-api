import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { CustomerService } from './customer.service';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';

@UseGuards(JwtAuthGuard)
@Controller('/api/approval/customer')
export class CustomerController {
  constructor(
    private services: CustomerService,
    private routeAccService: RouteAccService,
  ) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Approval Request Customer',
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

  @Get('/getData')
  async getData(
    @Query('order') order: string,
    @Query('search') search: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('filterdate') filterdate: string,
    @Req() req: any,
  ): Promise<any> {
    const user = req.user;

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
        : await this.services.countAll(search, user),
    };

    const data = isNaN(Number(limit))
      ? []
      : await this.services.get(
          order,
          search,
          Number(page) + 1,
          Number(limit),
          filterdate,
          user,
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
    @Req() req: any,
  ): Promise<any> {
    const user = req.user;
    const data: any = {
      id: id,
      updated_at: new Date(),
    };

    let result: any = {
      statusCode: 400,
      is_valid: false,
      message: 'Failed',
    };
    try {
      result = await this.services.save(data, user, this.routeAccService);
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }

  @Post('/reject')
  async reject(
    @Body('id') id: string,
    @Body('remarks') remarks: string,
    @Req() req: any,
  ): Promise<any> {
    const user = req.user;
    const data: any = {
      id: id,
      remarks: remarks,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let result: any = {
      statusCode: 400,
      is_valid: false,
      message: 'Failed',
    };
    try {
      result = await this.services.reject(data, user, this.routeAccService);
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }
}
