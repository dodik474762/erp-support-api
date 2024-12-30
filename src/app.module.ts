import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ValidationModule } from './validation/validation.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './role/role.guard';
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
import { CandidateTestModule } from './modules/recrutment/candidate_test/candidate_test.module';
import { JobModule } from './modules/data/job/job.module';
import { CandidateModule } from './modules/data/candidate/candidate.module';
import { CandidatesModule } from './modules/applied/candidates/candidates.module';
import { TestModule } from './modules/data/test/test.module';
import { DictionaryModule } from './modules/master/dictionary/dictionary.module';
import { QuestionsModule } from './modules/data/questions/questions.module';
import { JobTestModule } from './modules/scheduling/job_test/job_test.module';
import { CandidateTestsModule } from './modules/scheduling/candidate_tests/candidate_tests.module';
import { SummaryTestCfitModule } from './modules/report/summary_test_cfit/summary_test_cfit.module';
import { QuestionsDescribeModule } from './modules/data/questions_describe/questions_describe.module';
import { CompanyModule } from './modules/company/company.module';

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
    CandidateTestModule,
    JobModule,
    CandidateModule,
    CandidatesModule,
    TestModule,
    DictionaryModule,
    QuestionsModule,
    JobTestModule,
    CandidateTestsModule,
    SummaryTestCfitModule,
    QuestionsDescribeModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: RoleGuard
  },],
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
