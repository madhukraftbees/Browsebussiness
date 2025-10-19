// src/models/Cart.ts

import mongoose, { Schema, models } from "mongoose";

const CartSchema = new Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Cart = models.Cart || mongoose.model("Cart", CartSchema);
