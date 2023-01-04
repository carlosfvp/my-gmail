import { Module } from '@nestjs/common';
import { MailboxController } from './mailbox.controller';
import { MailboxService } from './mailbox.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Mailbox, MailboxSchema } from './schemas/mailbox.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mailbox.name, schema: MailboxSchema }]),
  ],
  controllers: [MailboxController],
  providers: [MailboxService],
})
export class MailboxModule {}
