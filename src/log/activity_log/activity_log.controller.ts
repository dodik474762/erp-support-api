import { Controller, Get, Query } from '@nestjs/common';
import { ActivityLogService } from './activity_log.service';

@Controller('/api/log/activity-log')
export class ActivityLogController {
    constructor(private actLog: ActivityLogService) {
        
    }

    @Get("/")
    index (): any {
        return {
            statusCode: 200,
            message: "Module Activity Log",
        }
    }

    @Get("/getAll")
    async getAll(
        @Query('limit') limit:string
    ): Promise<any> {
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
        };

        const data = await this.actLog.getAll(limit);
        result.data = data;
        return result;
    }
    
    @Get("/countAll")
    async countAll(
    ): Promise<any> {
        const result = {
            statusCode : 200,
            is_valid: true,
            data: [],
        };

        const data = await this.actLog.countAll("");
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
            total_page : await this.actLog.countAll(search)
        };

        const data = await this.actLog.get(order, search, Number(page) +1, Number(limit), filterdate);
        result.data = data;
        return result;
    }
}
