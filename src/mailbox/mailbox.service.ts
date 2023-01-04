import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mailbox, MailboxDocument } from 'src/mailbox/schemas/mailbox.schema';
import { CreateMailboxDto } from './dto/createMailboxDto';

@Injectable()
export class MailboxService {
  constructor(
    @InjectModel(Mailbox.name) private mailboxModel: Model<MailboxDocument>,
  ) {}

  async getMailboxByOwner(owner: string): Promise<MailboxDocument> {
    return this.mailboxModel.findOne({ Owner: owner }).exec();
  }

  async getMailboxByMailboxId(mailboxId: string): Promise<Mailbox> {
    return this.mailboxModel.findOne({ _id: mailboxId }).exec();
  }

  async createMailbox(createMailboxDto: CreateMailboxDto): Promise<Mailbox> {
    const createdMailbox = await this.mailboxModel.create(createMailboxDto);
    return createdMailbox;
  }
}
