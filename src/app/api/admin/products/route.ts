import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

// 🟢 GET — fetch all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// 🟢 POST — create a new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, brand, price, stock, size, color, image } = body;

    if (!name || !brand || !price || !stock || !size || !color) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const newProduct = await Product.create({
      name,
      brand,
      price,
      stock,
      size,
      color,
      image,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
