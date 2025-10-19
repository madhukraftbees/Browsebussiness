// src/models/Banner.ts
import mongoose, { Schema } from "mongoose";

const bannerSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    link: { type: String }, // optional: for "Shop Now" or category link
  },
  { timestamps: true }
);

export const Banner =
  mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
