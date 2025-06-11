import mongoose from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema;

export const BANNER_MODEL_NAME = "Banner";

export const bannerDTO = Yup.object().shape({
  title: Yup.string().required(),
  image: Yup.string().required(),
  isShow: Yup.boolean(),
});

export type Banner = Yup.InferType<typeof bannerDTO>;

const BannerSchema = new Schema<Banner>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    image: {
      type: Schema.Types.String,
      required: true,
    },
    isShow: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const BannerModel = mongoose.model(BANNER_MODEL_NAME, BannerSchema);
export default BannerModel;
