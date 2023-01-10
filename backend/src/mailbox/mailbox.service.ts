import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateMailboxDto } from './dto/createMailboxDto';
import { Folder } from './schemas/folder.schema';
import { Mailbox, MailboxDocument } from './schemas/mailbox.schema';

@Injectable()
export class MailboxService {
  constructor(
    @InjectModel(Mailbox.name) private mailboxModel: Model<MailboxDocument>,
  ) {}

  /**
   * Get mailbox by EmailAddress
   * @param owner
   * @returns
   */
  async getMailboxByOwner(owner: string): Promise<MailboxDocument> {
    return this.mailboxModel.findOne({ owner: owner }).exec();
  }

  /**
   * Get mailbox by mailboxId
   * @param mailboxId
   * @returns
   */
  async getMailboxByMailboxId(mailboxId: string): Promise<MailboxDocument> {
    return this.mailboxModel.findOne({ _id: mailboxId }).exec();
  }

  /**
   * Create mailbox with email address in DTO
   * @param createMailboxDto
   * @returns
   */
  async createMailbox(
    createMailboxDto: CreateMailboxDto,
  ): Promise<MailboxDocument> {
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
