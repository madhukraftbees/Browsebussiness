// src/app/api/admin/banner/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Banner } from "@/models/Banner";

export async function GET() {
  try {
    await connectDB();
    const banner = await Banner.find({});
    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, image, link } = body;

    if (!title || !subtitle || !link || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const newBanner = await Banner.create({
      title,
      subtitle,
      image,
      link,
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding banner:", error);
    return NextResponse.json(
      { error: "Failed to add banner" },
      { status: 500 }
    );
  }
}
