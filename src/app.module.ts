import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ValidationModule } from './validation/validation.module';
import { WebsocketModule } from './websocket/websocket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from './assets/assets.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/master/roles/roles.module';
import { env } from 'process';
import { UsersModule } from './modules/master/users/users.module';
import { JobTitleModule } from './modules/master/job_title/job_title.module';
import { EmployeeModule } from './modules/master/employee/employee.module';
import { MenuModule } from './modules/settings/menu/menu.module';
import { PermissionModule } from './modules/settings/permission/permission.module';
import { PassportModule } from '@nestjs/passport';
import { UnitModule } from './modules/master/unit/unit.module';
import { ActivityLogModule } from './log/activity_log/activity_log.module';
import { DictionaryModule } from './modules/master/dictionary/dictionary.module';
import { CompanyModule } from './modules/company/company.module';
import { DepartementModule } from './modules/master/departement/departement.module';
import { RoutingModule } from './modules/settings/routing/routing.module';
import { AccountModule } from './modules/data/account/account.module';
import { RequestItemModule } from './modules/transaction/request_item/request_item.module';
import { RouteAccModule } from './modules/helpers/route_acc/route_acc.module';
import { ItemModule } from './modules/approval/item/item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    })
    , ValidationModule
    , ValidationModule.forRoot(true)
    , WebsocketModule
    , TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.POSTGRES_HOST,
      port: Number(env.POSTGRES_PORT),
      username: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
    }), AssetsModule, AuthModule
    , RolesModule, UsersModule, JobTitleModule, EmployeeModule, MenuModule, PermissionModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),    
    UnitModule,
    ActivityLogModule,
    DictionaryModule,
    CompanyModule,
    DepartementModule,
    RoutingModule,
    AccountModule,
    RequestItemModule,
    RouteAccModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log(consumer);
    // consumer.apply(AuthMiddleware).forRoutes({
    //   path: '/api/users/current',
    //   method: RequestMethod.GET
    // });
  }

}
