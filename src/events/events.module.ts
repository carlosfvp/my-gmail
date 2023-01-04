import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MailboxService } from 'src/mailbox/mailbox.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Mailbox, MailboxSchema } from 'src/mailbox/schemas/mailbox.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mailbox.name, schema: MailboxSchema }]),
  ],
  providers: [EventsGateway, MailboxService],
})
export class EventsModule {}
