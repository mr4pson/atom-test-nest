import { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { counterParametersType } from 'src/shared/enum/counterParametersType';

interface CounterParameters extends Document {
  readonly data: string;
  readonly type: counterParametersType;
}

type CounterParametersModel = Model<CounterParameters>;

const CounterParametersSchema = new Schema(
  {
    data: SchemaTypes.String,
    type: SchemaTypes.String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { CounterParameters, CounterParametersModel, CounterParametersSchema };
