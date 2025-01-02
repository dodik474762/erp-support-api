import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutingHeader } from 'src/repository/master/routing_header.entity';
import { RoutingPermission } from 'src/repository/master/routing_permission.entity';
import { DataSource, IsNull, Repository } from 'typeorm';

@Injectable()
export class RouteAccService {
  constructor(
    @InjectRepository(RoutingHeader)
    private routingRepo: Repository<RoutingHeader>,
    @InjectRepository(RoutingPermission)
    private routingPermissionRepo: Repository<RoutingPermission>,
    private dataSource: DataSource,
  ) {}

  async routingCreate(menu: number, prevState : string): Promise<any> {
    const data = await this.routingPermissionRepo.findOne(
        {
            where: {
                deleted: IsNull(),
                menu: menu,
                prev_state: prevState
            },
            relations: ['menu_item'],
            order: {
                id: "ASC"
            }
        }
    );
    return data;
  }
}
