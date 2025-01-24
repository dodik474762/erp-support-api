import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { RouteAccService } from 'src/modules/helpers/route_acc/route_acc.service';
import { RequestCustomerService } from './request_customer.service';

@UseGuards(JwtAuthGuard)
@Controller('/api/transaction/request-customer')
export class RequestCustomerController {
  constructor(
      private services: RequestCustomerService,
      private routeAccService: RouteAccService,
    ) {}
  
    @Get('/')
    index(): any {
      return {
        statusCode: 200,
        message: 'Module Request Customer',
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
      @Body('customer_name') customer_name: string,
      @Body('subsidiary') subsidiary: { value: string; label: string },
      @Body('address') address: string,
      @Body('email') email: string,
      @Body('phone') phone: string,
      @Body('type') type: { value: string; label: string },
      @Body('picName') picName: string,
      @Body('picContact') picContact: string,
      @Body('picTitle') picTitle: string,
      @Body('datePermitStartDate') datePermitStartDate: string,
      @Body('datePermitEndDate') datePermitEndDate: string,
      @Body('dateCertificateCdobStartDate') dateCertificateCdobStartDate: string,
      @Body('dateCertificateCdobEndDate') dateCertificateCdobEndDate: string,
      @Body('remarks') remarks: string,
      @Body('dateApotekerStartDate') dateApotekerStartDate: string,
      @Body('dateApotekerEndDate') dateApotekerEndDate: { value: string; label: string },
      @Body('dateCertificateCdakbStartDate') dateCertificateCdakbStartDate: string,
      @Body('dateCertificateCdakbEndDate') dateCertificateCdakbEndDate: string,
      @Body('permitNumber') permitNumber: string,
      @Body('cdobNumber') cdobNumber: string,
      @Body('apotekerNumber') apotekerNumber: string,
      @Body('cdakbNumber') cdakbNumber: string,
      @Body('erpCode') erpCode: string,
      @Body('erpId') erpId: string,
      @Body('erpName') erpName: string,
    ): Promise<any> {
      const data: any = {
        id: id,
        users: users,
        customer_name: customer_name,
        customer_category: category && category.value,
        subsidiary: subsidiary && subsidiary.value,
        address: address,
        email: email,
        phone: phone,
        pic_name: picName,
        customer_type: type && type.value,
        pic_contact: picContact,
        pic_title: picTitle,
        date_permit_valid_start_date: datePermitStartDate,
        date_permit_valid_end_date: datePermitEndDate,
        date_certificate_cdob_start_date: dateCertificateCdobStartDate,
        date_certificate_cdob_end_date: dateCertificateCdobEndDate,
        date_permit_apoteker_start_date: dateApotekerStartDate,
        date_permit_apoteker_end_date: dateApotekerEndDate,
        date_certificate_cdakb_start_date: dateCertificateCdakbStartDate,
        date_certificate_cdakb_end_date: dateCertificateCdakbEndDate,
        permit_number: permitNumber,
        cdob_number: cdobNumber,
        apoteker_number: apotekerNumber,
        cdakb_number: cdakbNumber,
        remarks: remarks,
        customer_erp_code: erpCode,
        customer_erp_id: erpId,
        customer_erp_name: erpName,
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
          const routeAcc = await this.routeAccService.routingCreate(51, null);
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
