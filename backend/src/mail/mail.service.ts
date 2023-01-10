import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mailbox, MailboxDocument } from 'src/mailbox/schemas/mailbox.schema';
import { CreateMailDto } from './dto/createMailDto';
import { Mail, MailDocument } from './schemas/mail.schema';
import { Folder, FolderDocument } from 'src/mailbox/schemas/folder.schema';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(Mailbox.name) private mailboxModel: Model<MailboxDocument>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createMail(
    toMailboxId: string,
    fromMailboxId: string,
    createMailDto: CreateMailDto,
  ): Promise<void> {
    const toMail = await this.mailboxModel.updateOne(
      { _id: toMailboxId, 'folders.path': 'Inbox' },
      {
        $push: {
          'folders.$.mails': createMailDto,
        },
      },
    );

    this.eventsGateway.emitNewEmail(
      toMailboxId,
      'Inbox',
      createMailDto as Mail,
    );

    const fromMail = await this.mailboxModel.updateOne(
      { _id: fromMailboxId, 'folders.path': 'Sent' },
      {
        $push: {
          'folders.$.mails': createMailDto,
        },
      },
    );

    this.eventsGateway.emitNewEmail(
      fromMailboxId,
      'Sent',
      createMailDto as Mail,
    );
  }

  async deleteMail(
    mailboxId: string,
    folder: string,
    mailId: string,
  ): Promise<number> {
    let ret = await this.mailboxModel.updateOne(
      { _id: mailboxId },
      { $pull: { 'folders.mails': { _id: mailId } } },
    );
    return ret.matchedCount;
  }
}
