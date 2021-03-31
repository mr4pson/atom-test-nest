import { Document, Model, Schema, SchemaTypes } from 'mongoose';

interface Menu extends Document {
  readonly title: string;
  readonly url: string;
  readonly visible: boolean;
  readonly editable: boolean;
  readonly deletable: boolean;
  readonly subcategories: Partial<string[]>;
}

type MenuModel = Model<Menu>;

const MenuSchema = new Schema(
  {
    title: SchemaTypes.String,
    url: SchemaTypes.String,
    visible: SchemaTypes.Boolean,
    editable: SchemaTypes.Boolean,
    deletable: SchemaTypes.Boolean,
    subcategories: {
      type: [{ type: SchemaTypes.ObjectId, ref: 'Subcategory' }],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { Menu, MenuModel, MenuSchema };
