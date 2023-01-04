import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mailbox, MailboxDocument } from 'src/mailbox/schemas/mailbox.schema';
import { CreateMailDto } from './dto/createMailDto';
import { Mail, MailDocument } from './schemas/mail.schema';

@Injectable()
export class MailService {
  constructor(@InjectModel(Mail.name) private mailModel: Model<MailDocument>) {}

  // async getMailboxByMailboxId(mailboxId: string): Promise<Mailbox> {
  //   return this.mailModel.findOne({ _id: mailboxId }).exec();
  // }

  async createMail(createMailDto: CreateMailDto): Promise<MailDocument> {
    const createdMail = await this.mailModel.create(createMailDto);
    return createdMail;
  }

  async deleteMail(mailId: string): Promise<number> {
    let ret = await this.mailModel.deleteOne({ _id: mailId });
    return ret.deletedCount;
  }
}
