import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/repository/master/menu.entity';

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  imports: [
    TypeOrmModule.forFeature([Menu]),
  ],
})
export class MenuModule {}
