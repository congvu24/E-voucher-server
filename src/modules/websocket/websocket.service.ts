import { Injectable, Logger } from '@nestjs/common';
import type { WsResponse } from '@nestjs/websockets';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class WebsocketService {
  @WebSocketServer()
  server: Server;

  constructor() {
    Logger.log('hello');
    // this.server.on('connection', () => {
    //   Logger.log('Client connected');
    // });
  }

  claimSuccess(id: string): void {
    this.server.sockets.emit('claim_success', id);
  }
}
