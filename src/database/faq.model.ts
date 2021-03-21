import { Document, Model, Schema, SchemaTypes } from 'mongoose';

interface Faq extends Document {
  readonly title: string;
  readonly description: number;
}

type FaqModel = Model<Faq>;

const FaqSchema = new Schema(
  {
    title: SchemaTypes.String,
    description: SchemaTypes.String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { Faq, FaqModel, FaqSchema };
