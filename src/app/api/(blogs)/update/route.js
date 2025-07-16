import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await ConnectDB();
    const { blogId, title, slug, content, thumbnail, category, tags } = await req.json();

    const blog = await Blog.findById(blogId);
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    if (blog.author.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    blog.title = title || blog.title;
    blog.slug = slug || blog.slug;
    blog.content = content || blog.content;
    blog.thumbnail = thumbnail || blog.thumbnail;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;

    await blog.save();
    return NextResponse.json({ success: true, message: "Blog updated successfully", blog }, { status: 200 });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ success: false, message: "Failed to update blog" }, { status: 500 });
  }
}
