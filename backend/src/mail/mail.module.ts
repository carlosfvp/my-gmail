import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Mail, MailSchema } from './schemas/mail.schema';
import { MailboxService } from '../mailbox/mailbox.service';
import { Mailbox, MailboxSchema } from 'src/mailbox/schemas/mailbox.schema';
import { Folder, FolderSchema } from 'src/mailbox/schemas/folder.schema';
import { EventsModule } from '../events/events.module';
import { EventsGateway } from '../events/events.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mail.name, schema: MailSchema },
      { name: Mailbox.name, schema: MailboxSchema },
      { name: Folder.name, schema: FolderSchema },
    ]),
    EventsModule,
  ],
  controllers: [MailController],
  providers: [MailService, MailboxService, EventsGateway],
})
export class MailModule {}
