import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CandidateTestsService } from './candidate_tests.service';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/scheduling/candidate-test')
export class CandidateTestsController {
    constructor(private candidateTestService: CandidateTestsService) {
        
    }

    @Get("/")

    index (): any {
        return {
            statusCode: 200,
            message: "Module Candidate Schedule Test"
        }
    }

    @Get("/getAll")
    async getAll(): Promise<any> {
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
        };

        const data = await this.candidateTestService.getAll();
        result.data = data;
        return result;
    }
    
    @Get("/get-all-subtest")
    async getAllSubTest(
        @Query('candidate_test_id') candidate_test_id: string
    ): Promise<any> {
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
        };

        const data = await this.candidateTestService.getAllSubTest(candidate_test_id);
        result.data = data;
        return result;
    }
    
    @Get("/get-questions")
    async getAllSubTestQuestions(
        @Query('subtest_id') subtest_id: string
    ): Promise<any> {
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
        };

        const data = isNaN(Number(subtest_id)) ? [] : await this.candidateTestService.getAllSubTestQuestions(subtest_id);
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
            total_page : isNaN(Number(limit)) ? 0 : await this.candidateTestService.countAll(search)
        };

        const data = isNaN(Number(limit)) ? [] : await this.candidateTestService.get(order, search, Number(page) +1, Number(limit), filterdate);
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

        const data = await this.candidateTestService.getDetail(id);
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
    ): Promise<any>{
        const data : any= {
            id : id,
            job: job.value,
            remarks: remarks,
            start_date: start_date,
            end_date: end_date,
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
            result = await this.candidateTestService.save(data);
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
            result.data = await this.candidateTestService.delete(id);
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
            result.data = await this.candidateTestService.deleteAll(id);
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }
}
