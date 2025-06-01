import mongoose from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema;

export const bannerDAO = Yup.object().shape({
  title: Yup.string().required(),
  image: Yup.string().required(),
  isShow: Yup.boolean(),
});

export type Banner = Yup.InferType<typeof bannerDAO>;

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
).index({ name: "text" });

const BannerModel = mongoose.model("Banner", BannerSchema);
export default BannerModel;
