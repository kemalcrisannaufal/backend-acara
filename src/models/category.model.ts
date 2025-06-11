import mongoose from "mongoose";

import * as Yup from "yup";

const Schema = mongoose.Schema;

export const CATEGORY_MODEL_NAME = "Category";

export const categoryDTO = Yup.object({
  name: Yup.string().required(),
  description: Yup.string().required(),
  icon: Yup.string().required(),
});

export type Category = Yup.InferType<typeof categoryDTO>;

const CategorySchema = new Schema<Category>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    icon: {
      type: Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true }
).index({ name: "text", description: "text" });

const CategoryModel = mongoose.model(CATEGORY_MODEL_NAME, CategorySchema);
export default CategoryModel;
