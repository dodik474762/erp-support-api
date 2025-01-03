import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import * as bcrypt from 'bcrypt';
import { ActivityLogService } from 'src/log/activity_log/activity_log.service';
import { ApiBody, ApiCreatedResponse, ApiHeader } from '@nestjs/swagger';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'My header description',
  schema: {
    type: 'string',
    example: 'My header value',
  },
})
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logService: ActivityLogService,
  ) {}

  @Get()
  index(): string {
    return 'Module Auth';
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        is_valid: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'Success',
        },
        data: {
          type: 'object',
          example: {
            id: 1,
            nik: '1',
            employee_code: 'K001',
            username: 'dodik',
            name: 'Dodik Rismawan',
            password:
              '$2b$10$u5C1v7t/f4caxtBURdGGeuHdOTY8yumPt9hZ9xxcV1CtbMmPudISm',
            user_group: 1,
            created_at: '2024-10-10T02:30:31.508Z',
            deleted: null,
            updated_at: '2024-10-10T02:30:32.125Z',
          },
        },
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRvZGlrIiwicGFzc3dvcmQiOiJzYXN1a2UiLCJpYXQiOjE3MzAzNjQ2ODcsImV4cCI6MTczMDQ1MTA4N30.THBm3a7EWJe6IiM23eA15M1JGG1Dl0LWl71l24wJXwo',
        },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'admin',
        },
        password: {
          type: 'string',
          example: 'admin',
        },
      },
    },
  })
  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    const result: any = {
      statusCode: 200,
      is_valid: false,
      username: username,
      password: password,
      message: 'Failed',
      data: null,
    };

    const validation = await this.authService.validate({
      username: username,
      password: password,
    });
    if (validation) {
      const compare = await bcrypt.compare(password, validation.password);
      if (compare) {
        const token = await this.authService.login({
          username: username,
          password: password,
          users_id: validation.id,
          roles: validation.roles.roles_name,
        });
        result.data = validation;
        result.token = token;
        result.is_valid = true;

        this.logService.create({
          users: validation.id,
          remarks: 'Auth Sign In',
          table_db: 'users',
          reference_id: validation.id,
          account_code: 'AUTH',
          account: '0',
          action: 'Sign In',
          created_at: new Date(),
          updated_at: new Date(),
        });
      } else {
        result.message = 'Username atau Password salah';
        return result;
      }
    } else {
      result.message = 'Username atau Password salah';
      return result;
    }
    return result;
  }

  @Post('loginApp')
  async loginApp(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    const result: any = {
      statusCode: 200,
      is_valid: false,
      username: username,
      password: password,
      message: 'Failed',
      data: null,
    };

    const validation = await this.authService.validate({
      username: username,
      password: password,
    });
    if (validation) {
      const compare = await bcrypt.compare(password, validation.password);
      if (compare) {
        const token = await this.authService.login({
          username: username,
          password: password,
        });
        result.token = token;
        result.users_id = validation.id;
        result.kode_license = 'app-user';
        result.company = 'app-user';
        result.is_valid = true;

        this.logService.create({
          users: validation.id,
          remarks: 'Auth Sign In',
          table_db: 'users',
          reference_id: validation.id,
          account_code: 'AUTH',
          account: '0',
          action: 'Sign In',
          created_at: new Date(),
          updated_at: new Date(),
        });
      } else {
        result.message = 'Username atau Password salah';
        return result;
      }
    } else {
      result.message = 'Username atau Password salah';
      return result;
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('jwt-test')
  jwtTest(@Request() req): any {
    return {
      statusCode: 200,
      is_valid: true,
      message: 'Success Jwt',
      data: req.user,
    };
  }

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    // console.log(username, password, bcrypt);
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    return {
      statusCode: 200,
      is_valid: true,
      message: 'Success Logout',
      hashPassword: hash,
      username: username,
    };
  }

  @Get('logout')
  logout(): any {
    return {
      statusCode: 200,
      is_valid: true,
      message: 'Success Logout',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-akses-menu')
  async getAksesMenu(
    @Query('id') id: number,
    @Query('module') module: string,
  ): Promise<any> {
    const result = {
      statusCode: 200,
      is_valid: true,
      message: 'Success',
      module: module || '',
      data: null,
    };
    const data = await this.authService.getAksesMenu(id, module);
    result.data = data;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(
    @Body('user_id') user_id: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    const data: any = {
      user_id: user_id,
      username: username,
      password: password,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    let result: any = {
      statusCode: 200,
      is_valid: false,
      message: 'Failed',
    };
    try {
      data.password = hash;
      result = await this.authService.changePassword(data);
      result.password = hash;
    } catch (error) {
      result.message = String(error);
    }

    return result;
  }
}
