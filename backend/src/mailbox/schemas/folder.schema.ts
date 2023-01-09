import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Mail } from '../../mail/schemas/mail.schema';

export type FolderDocument = HydratedDocument<Folder>;

// @Schema()
export class Folder {
  @Prop({ type: String, required: true, lowercase: true })
  _id: string;

  @Prop()
  path: string;

  @Prop({ type: mongoose.Schema.Types.Array })
  mails: Mail[];
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
