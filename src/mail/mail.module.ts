import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Mail, MailSchema } from './schemas/mail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mail.name, schema: MailSchema }]),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
