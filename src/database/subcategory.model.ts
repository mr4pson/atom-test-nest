import { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { Menu } from './menu.model';
import { News } from './news.model';

interface Subcategory extends Document {
  readonly title: string;
  readonly url: string;
  readonly menu: Partial<Menu>;
  readonly news: Partial<News[]>;
}

type SubcategoryModel = Model<Subcategory>;

const SubcategorySchema = new Schema(
  {
    title: SchemaTypes.String,
    url: SchemaTypes.String,
    menu: { type: SchemaTypes.ObjectId, ref: 'Menu', required: true },
    news: { type: [{ type: SchemaTypes.ObjectId, ref: 'News' }] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export { Subcategory, SubcategoryModel, SubcategorySchema };
