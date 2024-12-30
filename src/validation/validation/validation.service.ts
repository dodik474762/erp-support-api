import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationService {
    validate(schema: ZodType<any>, data: any) : any{
        return schema.parse(data);
    }
}
