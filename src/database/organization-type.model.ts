import { Document, Model, Schema, SchemaTypes } from 'mongoose';

interface OrganizationType extends Document {
  readonly title: string;
}

type OrganizationTypeModel = Model<OrganizationType>;

const OrganizationTypeSchema = new Schema(
  {
    title: SchemaTypes.String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { OrganizationType, OrganizationTypeModel, OrganizationTypeSchema };
