import { Document, Model, Schema, SchemaTypes } from 'mongoose';

interface Partner extends Document {
  readonly title: string;
  readonly link: string;
  readonly uploadFile: string;
  readonly description: string;
  readonly visibility: boolean;
}

type PartnerModel = Model<Partner>;

const PartnerSchema = new Schema(
  {
    title: SchemaTypes.String,
    link: SchemaTypes.String,
    uploadFile: SchemaTypes.String,
    description: SchemaTypes.String,
    visibility: SchemaTypes.Boolean,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { Partner, PartnerModel, PartnerSchema };
