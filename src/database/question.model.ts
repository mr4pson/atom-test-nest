import { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { QuestionType } from '../shared/enum/QuestionType';

interface Question extends Document {
  readonly title: string;
  readonly image?: string;
  readonly type: QuestionType;
  readonly options: Partial<string[]>;
}

type QuestionModel = Model<Question>;

const QuestionSchema = new Schema(
  {
    title: SchemaTypes.String,
    image: { type: SchemaTypes.String, required: false },
    type: SchemaTypes.String,
    options: { type: [{ type: SchemaTypes.ObjectId, ref: 'QuestionOption' }] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { Question, QuestionModel, QuestionSchema };
