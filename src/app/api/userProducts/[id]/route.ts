// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import { Product } from "@/models/Product";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();
//     const product = await Product.findById(params.id).lean();
//     if (!product)
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     return NextResponse.json(product);
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch product" },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/userProducts/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
