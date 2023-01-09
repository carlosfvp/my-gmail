import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailboxModule } from './mailbox/mailbox.module';
import { EventsModule } from './events/events.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/my-gmail'),
    MailModule,
    MailboxModule,
    EventsModule,
  ],
})
export class AppModule {}
