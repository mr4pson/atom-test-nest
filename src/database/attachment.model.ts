import { Document, Model, Schema, SchemaTypes } from 'mongoose';

interface IAttachment extends Document {
  readonly fileName: string;
  readonly originalFileName: string;
  readonly mediaType: string;
  readonly fileSize: number;
  readonly isCommentAttachment: boolean;
  readonly parent?: string;
}

type IAttachmentModel = Model<IAttachment>;

const IAttachmentSchema = new Schema(
  {
    fileName: SchemaTypes.String,
    originalFileName: SchemaTypes.String,
    mediaType: SchemaTypes.String,
    fileSize: SchemaTypes.Number,
    isCommentAttachment: SchemaTypes.Boolean,
    parent: SchemaTypes.String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { IAttachment, IAttachmentModel, IAttachmentSchema };
