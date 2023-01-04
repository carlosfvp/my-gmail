import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Mail } from '../../mail/schemas/mail.schema';

export type FolderDocument = HydratedDocument<Folder>;

export class Folder {
  @Prop({
    unique: true,
  })
  path: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mail' }] })
  mails: Mail[];
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
