import { Module } from '@nestjs/common';
import { MailboxController } from './mailbox.controller';
import { MailboxService } from './mailbox.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Mailbox, MailboxSchema } from './schemas/mailbox.schema';
import { Folder, FolderSchema } from './schemas/folder.schema';
import { MailService } from '../mail/mail.service';
import { Mail, MailSchema } from 'src/mail/schemas/mail.schema';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mailbox.name, schema: MailboxSchema },
      { name: Folder.name, schema: FolderSchema },
      { name: Mail.name, schema: MailSchema },
    ]),
  ],
  controllers: [MailboxController],
  providers: [EventsGateway, MailboxService, MailService],
})
export class MailboxModule {}
