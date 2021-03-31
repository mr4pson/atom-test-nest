import { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { Subcategory } from './subcategory.model';

interface News extends Document {
  readonly name: string;
  readonly heading: string;
  readonly description: string;
  readonly uploadFile: string;
  readonly status: string; //TODO: add enum
  readonly subcategory: Partial<Subcategory>;
}

type NewsModel = Model<News>;

const NewsSchema = new Schema(
  {
    name: SchemaTypes.String,
    heading: SchemaTypes.String,
    description: SchemaTypes.String,
    uploadFile: SchemaTypes.String,
    status: SchemaTypes.String,
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
