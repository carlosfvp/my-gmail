import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Folder } from './folder.schema';

export type MailboxDocument = HydratedDocument<Mailbox>;

@Schema()
export class Mailbox {
  @Prop({
    required: true,
    unique: true,
  })
  owner: string;

  @Prop({ type: mongoose.Schema.Types.Array })
  folders: Folder[];
}

export const MailboxSchema = SchemaFactory.createForClass(Mailbox);
