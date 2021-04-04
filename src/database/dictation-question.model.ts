import { Document, Model, Schema, SchemaTypes } from 'mongoose';

interface DictationQuestion extends Document {
  readonly fullName: string;
  readonly message: number;
  readonly email: string;
}

type DictationQuestionModel = Model<DictationQuestion>;

const DictationQuestionSchema = new Schema(
  {
    fullName: SchemaTypes.String,
    message: SchemaTypes.String,
    email: SchemaTypes.String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { DictationQuestion, DictationQuestionModel, DictationQuestionSchema };
