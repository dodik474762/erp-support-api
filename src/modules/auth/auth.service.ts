import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/repository/master/company_entity';
import { PermissionUsers } from 'src/repository/master/permission_users.entity';
import { Users } from 'src/repository/master/users.entity';
import Core from 'src/utils/core';
import { Brackets, EntityManager, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    @InjectRepository(PermissionUsers)
    private permissionRepo: Repository<PermissionUsers>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getAksesMenu(id: number, module: string): Promise<any> {
    return this.permissionRepo
      .createQueryBuilder('permission_users')
      .select([
        'permission_users.*',
        'users.username as username',
        'menu.name as menu_name',
        'menu.parent as menu_parent',
        'menu.path as path',
        'menu.icon as icon',
      ])
      .innerJoin('menu', 'menu', 'menu.id = permission_users.menu')
      .innerJoin(
        'users_group',
        'users_group',
        'users_group.id = permission_users.user_group',
      )
      .innerJoin('users', 'users', 'users.user_group = users_group.id')
      .andWhere(
        new Brackets((qb) => {
          if (module) {
            qb.where('menu.path = :module', { module: module });
          }
        }),
      )
      .andWhere('permission_users.deleted IS NULL')
      .andWhere('users.id = :id', { id: id })
      .orderBy('menu.sort', 'ASC')
      .getRawMany();
  }

  async login(user) {
    const tokenLogin = this.jwtService.sign(user);
    return tokenLogin;
  }

  async validate(payload) {
    const data = await this.userRepo.findOne({
      where: { username: payload.username },
    });
    return data;
  }

  async getLicense(kode_license) {
    const current_date = Core.dateFormat(new Date());

    const data = await this.companyRepo
      .createQueryBuilder('company')
      .where('company.token_license = :license', { license: kode_license })
      .andWhere('company.deleted IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where("'" + current_date + "' >= company.start_date").andWhere(
            'company.end_date >= :current_date',
            { current_date: current_date },
          );
        }),
      )
      .getRawOne();
    return data;
  }

  async changePassword(data) : Promise<any> {
    const result = {
        is_valid : false,
        data : null,
        message: 'Failed',
        statusCode: 400
    };
    try {        
        const update = {
          password: data.password,
        };
        result.data = await this.userRepo.update(data.user_id, update);
        result.is_valid = true;
        result.message = 'Success';
        result.statusCode = 200;
    } catch (error) {
        result.message = String(error);
    }

    return result;
  }
}
