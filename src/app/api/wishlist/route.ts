// src/app/api/wishlist/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Wishlist } from "@/models/Wishlist";

export async function GET() {
  try {
    await connectDB();

    const items = await Wishlist.find().populate("productId").lean();

    const formatted = items.map((item) => ({
      ...item,
      product: item.productId,
      productId: item.productId?._id,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json();
    await connectDB();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return NextResponse.json(
        { success: true, message: "Item already exists in wishlist" },
        { status: 200 }
      );
    }

    const newItem = await Wishlist.create({ userId, productId });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, productId } = await req.json();
    await connectDB();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const deleted = await Wishlist.findOneAndDelete({ userId, productId });
    if (!deleted) {
      return NextResponse.json(
        { message: "Item not found in wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to delete wishlist item" },
      { status: 500 }
    );
  }
}
