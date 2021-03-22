import { Document, Model, Schema, SchemaTypes } from 'mongoose';

interface Participant extends Document {
  readonly name: string;
  readonly city: string;
  readonly number: string;
  readonly visible: boolean;
}

type ParticipantModel = Model<Participant>;

const ParticipantSchema = new Schema(
  {
    name: SchemaTypes.String,
    city: SchemaTypes.String,
    number: SchemaTypes.String,
    uploadFile: SchemaTypes.String,
    visible: SchemaTypes.Boolean,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { Participant, ParticipantModel, ParticipantSchema };
