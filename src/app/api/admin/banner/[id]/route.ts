import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Banner } from "@/models/Banner";

// export async function PUT(req: Request, { params }: { params: { id: any } }) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const updatedBanner = await Banner.findByIdAndUpdate(params.id, body, { new: true });
//     return NextResponse.json(updatedBanner);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
//   }
// }

export async function DELETE(req: Request, { params }: { params: { id: any } }) {
  try {
    await connectDB();
    await Banner.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Banner deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}

// src/app/api/admin/banner/[id]/route.ts

