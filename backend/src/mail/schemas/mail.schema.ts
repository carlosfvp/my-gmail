import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MailDocument = HydratedDocument<Mail>;

@Schema()
export class Mail {
  @Prop()
  to: string;

  @Prop()
  from: string;

  @Prop()
  subject: string;

  @Prop({ default: Date.now })
  sentDate: Date;

  @Prop()
  body: string;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  readDate: Date;
}

export const MailSchema = SchemaFactory.createForClass(Mail);
