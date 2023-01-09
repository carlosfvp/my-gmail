import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Mailbox, MailboxDocument } from 'src/mailbox/schemas/mailbox.schema';
import { CreateMailboxDto } from './dto/createMailboxDto';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class MailboxService {
  constructor(
    @InjectModel(Mailbox.name) private mailboxModel: Model<MailboxDocument>,
  ) {}

  async getMailboxByOwner(owner: string): Promise<MailboxDocument> {
    return this.mailboxModel.findOne({ owner: owner }).exec();
  }

  async getMailboxByMailboxId(mailboxId: string): Promise<MailboxDocument> {
    return this.mailboxModel.findOne({ _id: mailboxId }).exec();
  }

  async createMailbox(createMailboxDto: CreateMailboxDto): Promise<Mailbox> {
    const folder1: Folder = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      path: 'Inbox',
      mails: [],
    };
    const folder2: Folder = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      path: 'Sent',
      mails: [],
    };
    const folder3: Folder = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      path: 'Trash',
      mails: [],
    };

    const mailbox: Mailbox = {
      ...createMailboxDto,
      folders: [folder1, folder2, folder3],
    };

    const createdMailbox = await this.mailboxModel.create(mailbox);

    return createdMailbox;
  }
}
