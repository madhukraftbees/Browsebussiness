// // src/app/api/admin/banner/[id]/route.ts

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import { Banner } from "@/models/Banner";

// export async function PUT(req: Request, { params }: { params: { id: any } }) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const updatedBanner = await Banner.findByIdAndUpdate(params.id, body, {
//       new: true,
//     });
//     return NextResponse.json(updatedBanner);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update banner" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: any } }
// ) {
//   try {
//     await connectDB();
//     await Banner.findByIdAndDelete(params.id);
//     return NextResponse.json({ message: "Banner deleted" });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete banner" },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/admin/banner/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import { Banner } from "@/models/Banner";

// interface RouteParams {
//   params: Promise<{ id: string }>;
// }

// export async function PUT(req: NextRequest, { params }: RouteParams) {
//   try {
//     await connectDB();
//     const { id } = await params;
//     const body = await req.json();

//     const updatedBanner = await Banner.findByIdAndUpdate(id, body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedBanner) {
//       return NextResponse.json({ error: "Banner not found" }, { status: 404 });
//     }

//     return NextResponse.json(updatedBanner);
//   } catch (error) {
//     console.error("❌ Error updating banner:", error);
//     return NextResponse.json(
//       { error: "Failed to update banner" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest, { params }: RouteParams) {
//   try {
//     await connectDB();
//     const { id } = await params;

//     const deleted = await Banner.findByIdAndDelete(id);

//     if (!deleted) {
//       return NextResponse.json({ error: "Banner not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Banner deleted successfully" });
//   } catch (error) {
//     console.error("❌ Error deleting banner:", error);
//     return NextResponse.json(
//       { error: "Failed to delete banner" },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/admin/banner/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Banner } from "@/models/Banner";
import { withDB } from "@/lib/db-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatedBanner = await withDB(
      () => Banner.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      }),
      "Error updating banner"
    );

    if (!updatedBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBanner);
  } catch (error: any) {
    console.error("❌ Error updating banner:", error);
    
    if (error.message.includes("MONGODB_URI is not defined")) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const deletedBanner = await withDB(
      () => Banner.findByIdAndDelete(id),
      "Error deleting banner"
    );

    if (!deletedBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error deleting banner:", error);
    
    if (error.message.includes("MONGODB_URI is not defined")) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
