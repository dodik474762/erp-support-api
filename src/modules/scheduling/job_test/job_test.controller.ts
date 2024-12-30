import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JobTestService } from './job_test.service';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/scheduling/job-test')
export class JobTestController {
    constructor(private jobServices: JobTestService) {
        
    }

    @Get("/")

    index (): any {
        return {
            statusCode: 200,
            message: "Module Job Schedule Test"
        }
    }

    @Get("/getAll")
    async getAll(): Promise<any> {
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
        };

        const data = await this.jobServices.getAll();
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
            total_page : isNaN(Number(limit)) ? 0 : await this.jobServices.countAll(search)
        };

        const data = isNaN(Number(limit)) ? [] : await this.jobServices.get(order, search, Number(page) +1, Number(limit), filterdate);
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
            data_test: [],
        };

        const data = await this.jobServices.getDetail(id);
        const data_test = await this.jobServices.getListTestCategory(data);
        result.data = data;
        result.data_test = data_test;
        return result;
    }
    
    @Get('/get-all-test-active')
    async getListAllTestActive(): Promise<any>{
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
            data_test: [],
        };

        const data = await this.jobServices.getAllListTestCategory();
        result.data = data;
        return result;
    }

    @Post('/submit')
    async submit(
        @Body('id') id: string,
        @Body('job') job: {value: string, label:string},
        @Body('remarks') remarks: string,
        @Body('start_date') start_date: string,
        @Body('end_date') end_date: string,
        @Body('type_ist_test') type_ist_test: number,
        @Body('item_tests') item_tests: any[],
    ): Promise<any>{
        const data : any= {
            id : id,
            job: job.value,
            remarks: remarks,
            start_date: start_date,
            end_date: end_date,
            type_ist_test: type_ist_test,
            created_at : new Date(),
            updated_at : new Date(),
        };

        let result = {
            statusCode: 400,
            is_valid: false,
            message: 'Failed',
            data: data
        };      
        // console.log(data);
        try {            
            result = await this.jobServices.save(data, item_tests);
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
            result.data = await this.jobServices.delete(id);
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
            result.data = await this.jobServices.deleteAll(id);
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }
}
