import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Connection, createConnection, } from './connection/connection';
import { mailService, MailService } from './mail/mail.service';
// import { createUserRepository, UserRepository } from './user-repository/user-repository';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Roles } from 'src/repository/master/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Roles])],
  controllers: [UserController],
  providers: [UserService, {
    provide: Connection,
    // useClass : process.env.DATABASE == 'mysql' ? MySQLConnection : MongoDBConnection
    useFactory: createConnection,
    inject: [ConfigService]
  }, {
      provide: MailService,
      useValue: mailService
    },
    //  {
    //   provide: UserRepository,
    //   useFactory: createUserRepository,
    //   inject: [Connection],
    // },
    {
      provide: 'EmailService',
      useExisting: MailService
    }],
  exports: [UserService]
})
export class UserModule { }
