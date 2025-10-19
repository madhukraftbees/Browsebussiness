// src/app/api/cart/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/models/Cart";
import { Product } from "@/models/Product";

export async function GET() {
  await connectDB();

  // Get all cart items
  const items = await Cart.find();

  // Fetch product details for each cart item
  const itemsWithProduct = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.productId).lean();
      return {
        ...item.toObject(),
        product: product || null, // Include product info
      };
    })
  );

  return NextResponse.json(itemsWithProduct);
}

export async function POST(req: Request) {
  try {
    const { userId, productId, quantity } = await req.json();
    await connectDB();

    const existingItem = await Cart.findOne({ userId, productId });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return NextResponse.json(existingItem);
    }

    const newItem = await Cart.create({ userId, productId, quantity });
    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, productId } = await req.json();
    await connectDB();

    await Cart.findOneAndDelete({ userId, productId });
    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
