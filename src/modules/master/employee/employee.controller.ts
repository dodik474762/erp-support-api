import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { env } from 'process';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/master/employee')
export class EmployeeController {
    constructor(private emplyeeServices: EmployeeService) {
        
    }

    @Get("/")
    async index (): Promise<any> {
        return {
            statusCode: 200,
            message: "Module Employee",
            env: env.MYSQL_HOST,
        }
    }

    @Get("/getAll")
    async getAll(): Promise<any> {
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
        };

        const data = await this.emplyeeServices.getAll();
        result.data = data;
        return result;
    }

    @Get("/getData")
    async getData(
        @Query('order') order:string,
        @Query('search') search:string,
        @Query('page') page:string,
        @Query('limit') limit:string,
        @Query('filterdate') filterdate:string,
    ): Promise<any>{
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
            filterdate: filterdate,
            order: order,
            search: search,
            page: Number(page) +1,
            limit: Number(limit),
            total_page : isNaN(Number(limit)) ? 0 : await this.emplyeeServices.countAll(search)
        };

        const data = isNaN(Number(limit)) ? [] : await this.emplyeeServices.get(order, search, Number(page) +1, Number(limit), filterdate);
        result.data = data;
        return result;
    }

    @Get('/getDetail')
    async getDetail(
        @Query('id') id: string
    ): Promise<any>{
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
        };

        const data = await this.emplyeeServices.getDetail(id);
        result.data = data;
        return result;
    }

    @Post('/submit')
    async submit(
        @Body('id') id: string,
        @Body('name') name: string,
        @Body('address') address: string,
        @Body('job_title') job_title: {value: number, label: string},
        @Body('department') department: {value: number, label: string},
    ): Promise<any>{
        const data : any= {
            id : id,
            name: name,
            address : address,
            job_title : job_title.value,
            department: department.value,
            created_at : new Date(),
            updated_at : new Date(),
        };

        if (id == '') {
            data.employee_code = await this.emplyeeServices.generateCode();
        }

        let result = {
            statusCode: 200,
            is_valid: false,
            message: 'Failed',
        };      
        try {            
            result = await this.emplyeeServices.save(data);
        } catch (error) {
            result.message = String(error);
        }

        return result;
    }

    @Post('/delete')
    async delete(
        @Body('id') id: string
    ): Promise<any>{
        const result = {
            statusCode: 200,
            is_valid: false,
            id: id, 
            message: 'Failed',
            data: null,
        };

        try {
            result.data = await this.emplyeeServices.delete(id);
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }
    

    @Post('/deleteAll')
    async deleteAll(
        @Body('id') id: string[]
    ): Promise<any>{
        const result = {
            statusCode: 200,
            is_valid: false,
            id: id, 
            message: 'Failed',
            data: null,
        };
        try {
            console.log(id)
            result.data = await this.emplyeeServices.deleteAll(id);
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }
}
