import { Module } from '@nestjs/common';
import { Websocket } from './websocket';
import { WebsocketService } from './websocket.service';

@Module({
    providers: [Websocket, WebsocketService],
    exports:[WebsocketService]
})
export class WebsocketModule {}
