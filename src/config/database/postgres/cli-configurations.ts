import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Dodikitn123!',
  database: 'example',
  synchronize: false,
  logging: true,
  logger: "file",
  entities: ['src/repository/master/*.ts', 'src/repository/rekrutmen/*.ts'],
  migrations: ['migrations/*.ts'],  
});
