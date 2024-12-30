import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { env } from 'process';
import { JobTitleService } from './job_title.service';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/master/job_title')
export class JobTitleController {
    constructor(private jobTitleServices: JobTitleService) {
        
    }

    @Get("/")
    index (): any {
        return {
            statusCode: 200,
            message: "Module Job Title",
            env: env.MYSQL_HOST
        }
    }

    @Get("/getAll")
    async getAll(): Promise<any> {
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
        };

        const data = await this.jobTitleServices.getAll();
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
            total_page : isNaN(Number(limit)) ? 0 : await this.jobTitleServices.countAll(search)
        };

        const data = isNaN(Number(limit)) ? [] : await this.jobTitleServices.get(order, search, Number(page) +1, Number(limit), filterdate);
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

        const data = await this.jobTitleServices.getDetail(id);
        result.data = data;
        return result;
    }

    @Post('/submit')
    async submit(
        @Body('id') id: string,
        @Body('job_name') job_name: string,
    ): Promise<any>{
        const data : any = {
            id : id,
            job_name: job_name,
            created_at : new Date(),
            updated_at : new Date(),
        };

        if (id == '') {
            data.job_title_code = await this.jobTitleServices.generateCode();
        }

        let result = {
            statusCode: 200,
            is_valid: false,
            message: 'Failed',
        };      
        try {            
            result = await this.jobTitleServices.save(data);
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
            result.data = await this.jobTitleServices.delete(id);
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
            result.data = await this.jobTitleServices.deleteAll(id);
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }
}
