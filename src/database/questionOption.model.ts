import { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { Question } from './question.model';

interface QuestionOption extends Document {
  readonly question?: Partial<Question>;
  readonly title: string;
  readonly image?: string;
  readonly trueOption: boolean;
}

type QuestionOptionModel = Model<QuestionOption>;

const QuestionOptionSchema = new Schema(
  {
    question: { type: SchemaTypes.ObjectId, ref: 'Question', required: false },
    title: SchemaTypes.String,
    image: { type: SchemaTypes.String, required: false },
    trueOption: SchemaTypes.Boolean,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { QuestionOption, QuestionOptionModel, QuestionOptionSchema };
