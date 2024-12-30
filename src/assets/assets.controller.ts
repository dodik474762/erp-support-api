import { Controller, Get, Query } from '@nestjs/common';

@Controller('assets')
export class AssetsController {
    constructor() {}

    @Get()
    index(): string {
        return 'Module Assets';
    }

    @Get('/get_image')
    async getImage(@Query('filename') filename: string) : Promise<any>{
        return {
            statusCode: 200,
            message: 'Get Image',
            filename: filename
        };
    }
}
