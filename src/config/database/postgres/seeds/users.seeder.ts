/* eslint-disable @typescript-eslint/no-unused-vars */
// src/db/seeds/user.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Users } from 'src/repository/master/users.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY;');

    const repository = dataSource.getRepository(Users);
    await repository.insert({
      nik: '1',
      name: 'Dodik Rismawan',
      username: "dodik",
      password: "$2b$10$u5C1v7t/f4caxtBURdGGeuHdOTY8yumPt9hZ9xxcV1CtbMmPudISm",
      user_group: 1,
      created_at: new Date(),
      employee_code: "K001"
    });
  }
}