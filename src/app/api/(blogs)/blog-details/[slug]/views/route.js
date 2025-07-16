import { NextResponse } from "next/server";
import { headers } from "next/headers";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Visitor from "@/models/Visitor";

export async function POST(req, { params }) {
  try {
    await ConnectDB();
    const { slug } = await params;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "Unknown IP";

    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 10);

    const existingVisit = await Visitor.findOne({
      blogId: blog._id, 
      ipAddress,
      createdAt: { $gte: fifteenMinutesAgo },
    });

    if (!existingVisit) {
      await Visitor.create({ blogId: blog._id, ipAddress });
      await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } });
      return NextResponse.json({ success: true, message: "View tracking initiated" });
    }

    return NextResponse.json({ success: false, message: "View already counted within 15 minutes" });

  } catch (error) {
    console.error("Error tracking views:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
