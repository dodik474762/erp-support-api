import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { from, map, Observable } from "rxjs";
import { Server, Socket } from "socket.io";

@WebSocketGateway( {
    cors: {
        origin: '*',
        
    },
})
@Injectable()
export class Websocket implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleDisconnect(client: any) {
        console.log('disconected ' + client.ip);
    }
    
    async handleConnection(socket: Socket) {
        console.log('connected ' + socket);
    }

    @SubscribeMessage('events')
    onEvent(client: any, data: any): Observable<WsResponse<number>> {
      console.log('received:', data)
      console.log('emitted:', this.server.emit('event', 'test', 'hello event'))
      return from([1, 2, 3]).pipe(map(item => ({event: 'events', data: item})))
    }

    @SubscribeMessage('newMessage')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async onNewMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
        const data = JSON.parse(JSON.parse(JSON.stringify(body)));
        console.log(data, data['username']);

        // client.emit('receive_message', 'pesan diterima'); //for per client
        // this.server.emit('receive_message', 'pesan diterima'); // for broadcast
    }
}