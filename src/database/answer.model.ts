import { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { User } from './user.model';

interface Answer extends Document {
  readonly answers: string;
  readonly createdBy?: Partial<User>;
  readonly version: number;
}

type AnswerModel = Model<Answer>;

const AnswerSchema = new Schema(
  {
    answers: SchemaTypes.String,
    author: { type: SchemaTypes.ObjectId, ref: 'User', required: true },
    version: SchemaTypes.Number,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { Answer, AnswerModel, AnswerSchema };
