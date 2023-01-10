import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Mail } from '../mail/schemas/mail.schema';
import { MailboxService } from '../mailbox/mailbox.service';
import { MailboxDocument } from '../mailbox/schemas/mailbox.schema';

type ClientSocket = {
  socket: Socket;
  owner: string;
  mailboxId: string;
};

@WebSocketGateway(Number(process.env.WS_PORT), {
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

  /**
   * Client list, will be linked to mailbox data
   */
  clients: ClientSocket[] = [];

  /**
   * handleConnection
   * @param socket
   * @param args
   */

  handleConnection(socket: Socket, ...args: any[]) {
    this.clients.push({ socket: socket, owner: null, mailboxId: null });
  }

  /**
   * handleDisconnect
   * @param socket
   */
  handleDisconnect(socket: Socket) {
    const index = this.getClientIndexBySocket(socket);
    this.clients.splice(index, 1);
  }

  /**
   * Get client index by the socket id
   * @param socket
   * @returns
   */
  getClientIndexBySocket(socket: Socket): number {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].socket.id === socket.id) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Get ClientSocket object by the mailboxId(db model ID)
   * @param mailboxId
   * @returns
   */
  getClientByMailboxId(mailboxId: string): ClientSocket {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].mailboxId === mailboxId) {
        return this.clients[i];
      }
    }
    return null;
  }

  /**
   * Listen for frontend connection, sends back the client index
   * @param socket
   * @param owner
   * @returns
   */
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

  /**
   * Emit event to sender and recevied to notify for a new email object
   * @param mailboxId
   * @param path
   * @param mail
   * @returns
   */
  async emitNewEmail(mailboxId: string, path: string, mail: Mail) {
    const toClient = this.getClientByMailboxId(mailboxId);
    if (toClient == null) return;

    toClient.socket.emit('new_mail', { path: path, mail: mail });
  }
}
