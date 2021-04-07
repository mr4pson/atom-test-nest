import { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { Subcategory } from './subcategory.model';

interface News extends Document {
  readonly name: string;
  readonly description: string;
  readonly uploadFile: string;
  readonly status: string; //TODO: add enum
  readonly url: string;
  readonly subcategory: Partial<Subcategory>;
  readonly preview: string;
}

type NewsModel = Model<News>;

const NewsSchema = new Schema(
  {
    name: SchemaTypes.String,
    description: SchemaTypes.String,
    uploadFile: SchemaTypes.String,
    status: SchemaTypes.String,
    url: { type: SchemaTypes.String, unique: true },
    preview: { type: SchemaTypes.String, unique: true },
    subcategory: {
      type: SchemaTypes.ObjectId,
      ref: 'Subcategory',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { News, NewsModel, NewsSchema };
