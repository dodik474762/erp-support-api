import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { RequestVendorService } from './request_vendor.service';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';

@UseGuards(JwtAuthGuard)
@Controller('/api/transaction/request-vendor')
export class RequestVendorController {
  constructor(
    private services: RequestVendorService,
    private routeAccService: RouteAccService,
  ) {}

  @Get('/')
  index(): any {
    return {
      statusCode: 200,
      message: 'Module Request Vendor',
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
    };

    const data = await this.services.getDetail(id);
    result.data = data;
    return result;
  }

  @Post('/submit')
  async submit(
    @Body('id') id: string,
    @Body('category') category: { value: string; label: string },
    @Body('users') users: string,
    @Body('vendor_name') vendor_name: string,
    @Body('subsidiary') subsidiary: { value: string; label: string },
    @Body('address') address: string,
    @Body('email') email: string,
    @Body('phone') phone: string,
    @Body('type') type: { value: string; label: string },
    @Body('picName') picName: string,
    @Body('picContact') picContact: string,
    @Body('picTitle') picTitle: string,
    @Body('remarks') remarks: string,
    @Body('erpCode') erpCode: string,
    @Body('erpId') erpId: string,
    @Body('erpName') erpName: string,
  ): Promise<any> {
    const data: any = {
      id: id,
      users: users,
      vendor_name: vendor_name,
      vendor_category: category && category.value,
      subsidiary: subsidiary && subsidiary.value,
      address: address,
      email: email,
      phone: phone,
      pic_name: picName,
      vendor_type: type && type.value,
      pic_contact: picContact,
      pic_title: picTitle,
      remarks: remarks,
      vendor_erp_code: erpCode,
      vendor_erp_id: erpId,
      vendor_erp_name: erpName,
      created_at: new Date(),
      updated_at: new Date(),
    };

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
      result = await this.services.save(data);
      if (create && result.is_valid) {
        const routeAcc = await this.routeAccService.routingCreate(52, null);
        if (routeAcc) {
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
