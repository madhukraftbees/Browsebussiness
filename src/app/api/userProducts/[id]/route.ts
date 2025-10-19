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


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    const { id } = context.params;

    const product = await Product.findById(id).lean();
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
