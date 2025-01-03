import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';
import { ItemService } from './item.service';

@UseGuards(JwtAuthGuard)
@Controller('/api/approval/item')
export class ItemController {
  constructor(
    private services: ItemService,
    private routeAccService: RouteAccService,
  ) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Approval Request Item',
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
          user
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
    @Body('item_name') item_name: string,
    @Body('users') users: string,
    @Body('account') account: { value: string; label: string },
    @Body('departement') departement: { value: string; label: string },
    @Body('remarks') remarks: string,
  ): Promise<any> {
    const data: any = {
      id: id,
      users: users,
      item_name: item_name,
      remarks: remarks,
      departemen: departement.value,
      departemen_name: departement.label,
      account: account.value,
      account_name: account.label,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let result: any = {
      statusCode: 400,
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
}
