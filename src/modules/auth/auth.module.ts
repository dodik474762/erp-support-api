import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
// import { env } from 'process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/repository/master/users.entity';
import { PermissionUsers } from 'src/repository/master/permission_users.entity';
import { Company } from 'src/repository/master/company_entity';
import { ActivityLogModule } from 'src/log/activity_log/activity_log.module';
@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({    
      secret: "927d6104c416705a55c8179ef722b44da4d8b281153215572bbbf5f552150f99",    
      signOptions: { expiresIn: '24h' }
    
    }),
    TypeOrmModule.forFeature([Users, PermissionUsers, Company]),
    ActivityLogModule
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
