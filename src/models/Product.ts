// models/Product.ts
import mongoose, { Schema, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    size: { type: String, enum: ["S", "M", "L", "XL"], required: true },
    color: { type: String, required: true }, // e.g., "Red", "Blue"
    image: { type: String }, // can be URL or file path
  },
  { timestamps: true }
);

export const Product =
  models.Product || mongoose.model("Product", productSchema);
