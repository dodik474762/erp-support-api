// import { Controller, Get, Header, HttpCode, HttpRedirectResponse, Inject, Optional, Param, Post, Query, Redirect, Req, Res, HttpException, ParseIntPipe, UseFilters, Body, UseInterceptors, UploadedFile, } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { UserService } from './user.service';
// import { Connection } from '../connection/connection';
// import { MailService } from '../mail/mail.service';
// import { UserRepository } from '../user-repository/user-repository';
// import { User } from '@prisma/client';
// import { ValidationFilter } from 'src/validation/validation.filter';
// import { ValidationPipe } from 'src/validation/validation.pipe';
// import { LoginUserRequest, loginUserRequestValidation } from 'src/model/login.model';
// import { TimeInterceptor } from 'src/time/time.interceptor';
// import { Auth } from 'src/auth/auth.decorator';
// // import { RoleGuard } from 'src/role/role.guard';
// import { Roles } from 'src/role/role.decorator';
// import { WebsocketService } from 'src/websocket/websocket.service';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { ValidationFilter } from 'src/validation/validation.filter';

import { Controller } from "@nestjs/common";

@Controller('/api/users')
// @UseGuards(RoleGuard)
export class UserController {
    // constructor(private service: UserService){} // pakai contractor
    // @Inject()
    // @Optional()
    // private service: UserService;

    // @Inject()
    // private connection: Connection;

    // @Inject()
    // private mailService: MailService;

    // @Inject()
    // private userRepository: UserRepository;

    // @Inject('EmailService')
    // private emailService: MailService;

    // @Inject()
    // @Optional()
    // private websocketService: WebsocketService;


    // @Post()
    // post(): string {
    //     return 'POST';
    // }

    // @Get('/sample')
    // get(): string {
    //     return 'GET HELLO';
    // }

    // @Get('/connection')
    // async getConnection(
    // ): Promise<string> {
    //     // this.userRepository.save();
    //     this.mailService.send();
    //     this.emailService.send();
    //     return this.connection.getName();
    // }

    // @Get('/create')
    // async createUser(@Query('nik') nik: string, @Query('password') password: string): Promise<User> {
    //     return this.userRepository.save(nik, password);
    // }

    // @Get('/hello')
    // // @UseFilters(ValidationFilter)
    // async sayHello(
    //     @Query('first_name') first_name: string,
    //     @Query('last_name') last_name: string
    // ): Promise<string> {
    //     if (!first_name) {
    //         throw new HttpException({ code: 400, errors: 'First Name Required' }, 400);
    //     }
    //     return this.service.sayHello(first_name + last_name);
    // }

    // @Get('/sample-response')
    // @Header('Content-Type', 'application/json')
    // @HttpCode(200)
    // sampleResponse(): Record<string, string> {
    //     return {
    //         data: 'Hello JSON'
    //     };
    // }

    // @Get('/redirect')
    // @Redirect()
    // redirect(): HttpRedirectResponse {
    //     return {
    //         url: '/api/users/sample-response',
    //         statusCode: 301
    //     };
    // }

    // @Get('/set-cookie')
    // setCookie(@Query('name') name: string, @Res() response: Response) {
    //     response.cookie('name', name);
    //     response.status(200).send('Success Set Cookie');
    // }

    // @Get('/get-cookie')
    // getCookie(@Req() request: Request): string {
    //     return request.cookies['name'];
    // }

    // @Get('/view/hello')
    // viewHello(@Query('name') name: string, @Res() response: Response) {
    //     response.render('index.html', {
    //         title: 'Template Engine',
    //         name: name
    //     });
    // }

    // @Get('/current')
    // @Roles([10])
    // current(@Auth() user: User): any {
    //     return {
    //         data: 'Hello ' + user.username
    //     };
    // }

    // @Post('/sendmessage')
    // sendMessage(@Body('message') message: string): string {
    //     console.log(this.websocketService);
    //     // console.log(socket);
    //     // socket.emit("receive_message", message);
    //     return 'send message ' + message;
    // }

    // @Get('/:id')
    // getById(@Param('id', ParseIntPipe) id: number): string {
    //     console.log(id * 10);
    //     return 'GET HELLO ' + id;
    // }

    // @Post('/login')
    // @UseFilters(ValidationFilter)
    // @UseInterceptors(TimeInterceptor)
    // @Header('Content-Type', 'application/json')
    // login(@Body(new ValidationPipe(loginUserRequestValidation)) request: LoginUserRequest): any {
    //     return {
    //         data: 'HELLO ' + request.username
    //     };
    // }

    // @Post('/upload')
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: diskStorage({
    //         destination: 'public/img/' + new Date().getFullYear() + "-" + new Date().getMonth(),
    //         filename: (req, file, cb) => {
    //             cb(null, file.originalname);
    //         }
    //     })
    //     // dest: 'public/img/'+ new Date().getFullYear()+"-"+new Date().getMonth(),
    // }))

    // async upload(@UploadedFile() file: Express.Multer.File): Promise<any> {
    //     // const data = await this.service.findAll();
    //     // for (let index = 0; index < data.length; index++) {
    //     //     const element = data[index];
    //     //     if (element.created_at) {
    //     //         console.log(element);
    //     //     }
    //     // }
    //     return {
    //         statusCode: 200,
    //         data: file.path,
    //         // total_rows: data.length
    //     };
    // }

    // @Post("getUser")
    // async getUser(): Promise<any> {
    //     const data = await this.service.findAll();
    //     // for (let index = 0; index < data.length; index++) {
    //     //     const element = data[index];
    //         // if (element.created_at) {
    //         //     console.log(element);
    //         // }
    //     // }
    //     return {
    //         statusCode: 200,
    //         total_rows: data.length,
    //         data: data,
    //     };
    // }
    
    // @Post("getUserBy")
    // async getUserBy(@Body("id") id:string): Promise<any> {
    //     const data = await this.service.findOne(Number(id));
    //     return {
    //         statusCode: data == null ? 500 : 200,
    //         data: data,
    //         message: data == null ? 'Data Tidak Ditemukan' : 'Data Ditemukan',
    //     };
    // }
    
    // @Post("saveUser")
    // async saveUser(@Body("username") username:string, @Body("password") password:string): Promise<any> {        
    //     const user = {
    //         username: username,
    //         password: password,
    //         roles: 1
    //     };
    //     const users = await this.service.save(user as User);
        
    //     return {
    //         statusCode: 200,
    //         data: users
    //     };
    // }
    
    // @Post("updateUser")
    // async updateUser(@Body("id") id:string, @Body("username") username:string): Promise<any> {        
    //     const val_update = {
    //         username: username,
    //         updated_at: new Date()
    //     };

    //     const result = await this.service.update(Number(id), val_update);
        
    //     return {
    //         statusCode: 200,
    //         data: result
    //     };
    // }
    
    // @Post("getNormalQuery")
    // async getNormalQuery() : Promise<any> {        
    //     const users = await this.service.getUserNormal();
        
    //     return {
    //         statusCode: 200,
    //         data: users
    //     };
    // }
    
    // @Post("getUserJoin")
    // async getUserJoin() : Promise<any> {        
    //     const users = await this.service.getUserJoin();
        
    //     return {
    //         statusCode: 200,
    //         data: users
    //     };
    // }
    
    // @Post("getRelasi")
    // async getRelasi() : Promise<any> {        
    //     const users = await this.service.getRelasi();
        
    //     return {
    //         statusCode: 200,
    //         data: users
    //     };
    // }
}
