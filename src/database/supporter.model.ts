import { Document, Model, Schema, SchemaTypes } from 'mongoose';

interface Suppoter extends Document {
  readonly fullName: string;
  readonly position: string;
  readonly uploadFile: string;
  readonly organization: string;
}

type SuppoterModel = Model<Suppoter>;

const SupporterSchema = new Schema(
  {
    fullName: SchemaTypes.String,
    position: SchemaTypes.String,
    uploadFile: SchemaTypes.String,
    organization: SchemaTypes.String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { Suppoter, SuppoterModel, SupporterSchema };
