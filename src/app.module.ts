import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailboxModule } from './mailbox/mailbox.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/my-gmail'),
    MailboxModule,
  ],
})
export class AppModule {}
