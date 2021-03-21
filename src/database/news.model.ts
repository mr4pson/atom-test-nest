import { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { QuestionType } from '../shared/enum/QuestionType';

interface News extends Document {
  readonly name: string;
  readonly heading: string;
  readonly description: string;
  readonly uploadFile: string;
  readonly status: string; //TODO: add enum
}

type NewsModel = Model<News>;

const NewsSchema = new Schema(
  {
    name: SchemaTypes.String,
    heading: SchemaTypes.String,
    description: SchemaTypes.String,
    uploadFile: SchemaTypes.String,
    status: SchemaTypes.String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { News, NewsModel, NewsSchema };
