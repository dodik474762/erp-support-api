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
      sales_item: [],
    };

    const data = await this.services.getDetail(id);
    const sales_item = await this.services.getDetailSalesItem(id);
    result.data = data;
    result.sales_item = sales_item;
    return result;
  }

  @Post('/submit')
  async submit(
    @Body('id') id: string,
    @Body('cogsAcount') cogsAcount: { value: string; label: string },
    @Body('assetAcount') assetAcount: { value: string; label: string },
    @Body('incomeAccount') incomeAccount: { value: string; label: string },
    @Body('gainAcount') gainAcount: { value: string; label: string },
    @Body('priceVarianAccount') priceVarianAccount: { value: string; label: string },
    @Body('qtyVarianAcount') qtyVarianAcount: { value: string; label: string },
    @Body('exhangeAcount') exhangeAcount: { value: string; label: string },
    @Body('wipAcount') wipAcount: { value: string; label: string },
    @Body('scrapAcount') scrapAcount: { value: string; label: string },
    @Body('wpAcount') wpAcount: { value: string; label: string },
    @Body('unbuildAcount') unbuildAcount: { value: string; label: string },
    @Body('adjustAcount') adjustAcount: { value: string; label: string },
    @Req() req: any,
  ): Promise<any> {
    const user = req.user;
    const data: any = {
      id: id,
      account: cogsAcount.value,
      account_name: cogsAcount.label,
      asset_account: assetAcount.value,
      asset_account_name: assetAcount.label,
      income_account: incomeAccount.value,
      income_account_name: incomeAccount.label,
      gain_account: gainAcount.value,
      gain_account_name: gainAcount.label,
      price_account: priceVarianAccount.value,
      price_account_name: priceVarianAccount.label,
      qty_account: qtyVarianAcount.value,
      qty_account_name: qtyVarianAcount.label,
      rate_account: exhangeAcount.value,
      rate_account_name: exhangeAcount.label,
      wip_account: wipAcount.value,
      wip_account_name: wipAcount.label,
      scrap_account: scrapAcount.value,
      scrap_account_name: scrapAcount.label,
      wip_cost_account: wpAcount.value,
      wip_cost_account_name: wpAcount.label,
      unbuild_account: unbuildAcount.value,
      unbuild_account_name: unbuildAcount.label,
      adjust_account: adjustAcount.value,
      adjust_account_name: adjustAcount.label,
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
