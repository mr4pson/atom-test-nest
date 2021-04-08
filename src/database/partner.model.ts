import { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { OrganizationType } from './organization-type.model';

interface Partner extends Document {
  readonly title: string;
  readonly link: string;
  readonly massMedia: string;
  readonly uploadFile: string;
  readonly description: string;
  readonly ownType: string;
  readonly visible: boolean;
  readonly organizationType: Partial<OrganizationType>;
}

type PartnerModel = Model<Partner>;

const PartnerSchema = new Schema(
  {
    title: SchemaTypes.String,
    link: SchemaTypes.String,
    massMedia: SchemaTypes.String,
    uploadFile: SchemaTypes.String,
    description: SchemaTypes.String,
    ownType: SchemaTypes.String,
    visible: SchemaTypes.Boolean,
    organizationType: {
      type: SchemaTypes.ObjectId,
      ref: 'OrganizationType',
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { Partner, PartnerModel, PartnerSchema };
