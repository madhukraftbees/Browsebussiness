import mongoose, { Schema, models } from "mongoose";

const WishlistSchema = new Schema(
  {
    userId: { type: String, required: true },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // 👈 Link to Product model
        required: true,
      },
  },
  { timestamps: true }
);

export const Wishlist = models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
