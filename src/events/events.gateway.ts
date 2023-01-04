import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Mail, MailDocument } from '../mail/schemas/mail.schema';
import { MailboxService } from 'src/mailbox/mailbox.service';
import { MailboxDocument } from 'src/mailbox/schemas/mailbox.schema';

interface ClientSocket {
  socket: Socket;
  owner: string;
  mailboxId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  constructor(private readonly mailboxService: MailboxService) {}

  @WebSocketServer()
  server: Server;

  clients: ClientSocket[] = [];

  handleConnection(socket: Socket, ...args: any[]) {
    this.clients.push({ socket: socket, owner: null, mailboxId: null });
  }

  handleDisconnect(socket: Socket) {
    const index = this.getClientIndexBySocket(socket);
    this.clients.splice(index, 1);
  }

  getClientIndexBySocket(socket: Socket): number {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].socket.id === socket.id) {
        return i;
      }
    }
    return -1;
  }

  getClientBySocket(socket: Socket): ClientSocket {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].socket.id === socket.id) {
        return this.clients[i];
      }
    }
    return null;
  }

  getClientByOwner(owner: string): ClientSocket {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].owner === owner) {
        return this.clients[i];
      }
    }
    return null;
  }

  @SubscribeMessage('subscribe')
  async handleEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody('owner') owner: string,
  ): Promise<number> {
    const clientIndex = this.getClientIndexBySocket(socket);
    if (clientIndex === -1) return -1;

    const mailbox: MailboxDocument =
      await this.mailboxService.getMailboxByOwner(owner);

    if (mailbox === null) return -1;

    this.clients[clientIndex].owner = owner;
    this.clients[clientIndex].mailboxId = mailbox._id.toString();

    return clientIndex;
  }

  async emitNewEmail(toOwner: string, mail: Mail) {
    const toMailbox = await this.mailboxService.getMailboxByOwner(toOwner);
    if (toMailbox == null) return;

    const toClient = this.getClientByOwner(toOwner);
    if (toClient == null) return;

    toClient.socket.emit('new_mail', mail);
  }
}
