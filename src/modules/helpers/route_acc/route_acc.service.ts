import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actors } from 'src/repository/master/actor.entity';
import { DocumentTransaction } from 'src/repository/master/document_transaction.entity';
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
    @InjectRepository(Actors)
    private actorRepo: Repository<Actors>,
    @InjectRepository(DocumentTransaction)
    private docTransRepo: Repository<DocumentTransaction>,
    private dataSource: DataSource,
  ) {}

  async routingCreate(menu: number, prevState: string): Promise<any> {
    const data = await this.routingPermissionRepo.findOne({
      where: {
        deleted: IsNull(),
        menu: menu,
        prev_state: prevState,
        is_active: 1,
      },
      relations: ['menu_item'],
      order: {
        state: 'ASC',
      },
    });
    return data;
  }

  async routingAcc(
    users: number,
    menu: number,
    prevState: string,
  ): Promise<any> {
    const data = await this.routingPermissionRepo.findOne({
      where: {
        deleted: IsNull(),
        menu: menu,
        prev_state: prevState,
        is_active: 1,
        users: users,
      },
      relations: ['menu_item'],
      order: {
        state: 'ASC',
      },
    });
    return data;
  }

  async checkIsLastRouting(menu: number, prevState: string): Promise<any> {
    const data = await this.routingPermissionRepo.findOne({
      where: {
        deleted: IsNull(),
        menu: menu,
        prev_state: prevState,
        is_active: 1,
      },
      relations: ['menu_item'],
      order: {
        state: 'desc',
      },
    });

    let isValid = false;
    if (data) {
      if (data.prev_state == prevState) {
        isValid = true;
      }
    }
    return isValid;
  }

  async createLogTransaction(
    users: number,
    code: string,
    desc: string,
    remarks: string,
    state: string,
  ) {
    try {
      const actors = {
        users: users,
        content: desc,
        action: desc,
      };

      const actor = await this.actorRepo.save(actors);
      const actorId = actor.id;

      const logs = {
        actors: actorId,
        no_document: code,
        remarks: remarks,
        state: state,
      };

      await this.docTransRepo.save(logs);
    } catch (error) {
      console.log(error);
    }
  }
}
