import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/data/candidate')
export class CandidateController {
    constructor(private candidateServices: CandidateService) {
        
    }

    @Get("/")

    index (): any {
        return {
            statusCode: 200,
            message: "Module Candidate"
        }
    }

    @Get("/getAll")
    async getAll(): Promise<any> {
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
        };

        const data = await this.candidateServices.getAll();
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
            total_page : isNaN(Number(limit)) ? 0 :await this.candidateServices.countAll(search)
        };

        const data = isNaN(Number(limit)) ? [] : await this.candidateServices.get(order, search, Number(page) +1, Number(limit), filterdate);
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

        const data = await this.candidateServices.getDetail(id);
        result.data = data;
        return result;
    }

    @Post('/submit')
    async submit(
        @Body('id') id: string,
        @Body('nama_lengkap') nama_lengkap: string,
        @Body('nik') nik: string,
        @Body('contact') contact: string,
        @Body('email') email: string,
        @Body('alamat') alamat: string,
    ): Promise<any>{
        const data : any= {
            id : id,
            nama_lengkap: nama_lengkap,
            nik: nik,
            contact: contact,
            email: email,
            alamat: alamat,
            created_at : new Date(),
            updated_at : new Date(),
        };

        let result = {
            statusCode: 200,
            is_valid: false,
            message: 'Failed',
        };      
        try {            
            result = await this.candidateServices.save(data);
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
            result.data = await this.candidateServices.delete(id);
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
            result.data = await this.candidateServices.deleteAll(id);
            result.is_valid = true;
            result.message = 'Success';
        } catch (error) {
            result.message = String(error);
        }
        return result;
    }
}
