import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessageWsService } from './message-ws.service';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // decorador de propiedad
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    // recuerda que el header extra estaba en handshake.headers.xxx
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    // handling errors
    try {
      payload = this.jwtService.verify(token);
      // COMPROBAR SI YA ESTA CONECTADO
      await this.messageWsService.registerClient(client, payload.id);
      // this.messageWsService.isAlreadyConnected(client,payload.id)
        
      // podria unir a una sala nada mas que entre al cliente(con un id mejor)
      // client.join('sala 01')
    } catch (error) {
      return client.disconnect();
    }
    // en el server wss.emit('eventName',payload) emite a todos
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    // al desconectar tmb queremos emitir la lista de Ids
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    // emit solo emite al cliente inicial(client.emit)
    /* client.emit('message-from-server',{
      fullName: 'Soy yo',
      message: payload.message || 'no-message!!'
    }) */
    // emitir a todos menos al cliente inicial(client.broadcast.emit)
    client.broadcast.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'no-message!!',
    });
    // para mandar a todos es wss.emit
    /* this.wss.emit('message-from-server',{
      fullName: 'Soy yo',
      message: payload.message || 'no-message!!'
    }) */
    // para emitir a alguien en concreto es wss.to(room:string|string[]) que necesita una sala(para esto cuando un cliente se conecta se le une a una sala con client.join(room) como primera instrucción)
  }
}
