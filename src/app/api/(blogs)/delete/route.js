import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await ConnectDB();
    const { blogId } = await req.json();
    
    const blog = await Blog.findById(blogId);
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    if (blog.author.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Blog.findByIdAndDelete(blogId);
    return NextResponse.json({ success: true, message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ success: false, message: "Failed to delete blog" }, { status: 500 });
  }
}
