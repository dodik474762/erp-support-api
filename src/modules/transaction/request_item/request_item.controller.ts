import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { RequestItemService } from './request_item.service';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';

@UseGuards(JwtAuthGuard)
@Controller('/api/transaction/request-item')
export class RequestItemController {
  constructor(
    private services: RequestItemService,
    private routeAccService: RouteAccService,
  ) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Request Item',
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
    @Body('item_name') item_name: string,
    @Body('users') users: string,
    @Body('departement') departement: { value: string; label: string },
    @Body('subsidiary') subsidiary: { value: string; label: string },
    @Body('unitType') unitType: { value: string; label: string },
    @Body('unitStock') unitStock: { value: string; label: string },
    @Body('unitPurchase') unitPurchase: { value: string; label: string },
    @Body('unitSales') unitSales: { value: string; label: string },
    @Body('volumeType') volumeType: { value: string; label: string },
    @Body('incubationDay') incubationDay: string,
    @Body('costCategory') costCategory: { value: string; label: string },
    @Body('purchasePrice') purchasePrice: string,
    @Body('planningItemCategory') planningItemCategory: { value: string; label: string },
    @Body('replanishmentMethod') replanishmentMethod: { value: string; label: string },
    @Body('taxSchedule') taxSchedule: { value: string; label: string },
    @Body('typeProduct') typeProduct: { value: string; label: string },
    @Body('remarks') remarks: string,
    @Body('generateAccural') generateAccural: string,
    @Body('groupType') groupType: { value: string; label: string },
    @Body('autoCalculate') autoCalculate: string,
    @Body('sales_items') sales_items: any[],
  ): Promise<any> {
    const data: any = {
      id: id,
      users: users,
      item_name: item_name,
      remarks: remarks,
      departemen: departement.value,
      departemen_name: departement.label,
      subsidiary: subsidiary.value,
      primary_unit: unitType.value,
      primary_stock_unit: unitStock.value,
      primary_purchase_unit: unitPurchase.value,
      primary_sale_unit: unitSales.value,
      primary_consumtion_unit: unitType && unitType.value,
      volume_type: volumeType && volumeType.value,
      incubation_days: incubationDay,
      costing_method: costCategory.value,
      cost_category: costCategory.value,
      purchase_price: purchasePrice,
      planning_item_category: planningItemCategory && planningItemCategory.value,
      replanisment_method: replanishmentMethod.value,
      tax_schedule: taxSchedule.value,
      product_type: typeProduct.value,
      generate_accrual: generateAccural ? 1 : 0,
      group_type: groupType && groupType.value,
      auto_calculate: autoCalculate ? 1 : 0,
      item_category: typeProduct.value,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // console.log('data', data);
    // console.log('sales_items', sales_items);
    let create = false;
    if (id == '') {
      data.code = await this.services.generateCode();
      data.item_code = data.code;
      data.status = 'DRAFT';
      create = true;
    }

    let result: any = {
      statusCode: 400,
      is_valid: false,
      message: 'Failed',
    };
    try {
      result = await this.services.save(data, sales_items);
      if (create && result.is_valid) {
        const routeAcc = await this.routeAccService.routingCreate(33, null);
        if(routeAcc){
            await this.services.updateRouting(routeAcc, result.data.id);
        }
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
