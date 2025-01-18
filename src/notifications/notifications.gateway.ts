import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Enable CORS for WebSocket
export class NotificationsGateway {

  @WebSocketServer()
  server: Server;

  sendNotification(message: string) {
    if (!message || typeof message !== 'string') {
      console.error('Invalid message:', message);
      return;
    }
    this.server.emit('notification', message);
  }
  
  
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log('Message received:', message);
  }
}