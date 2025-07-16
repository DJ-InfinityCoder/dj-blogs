import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import { isAuthenticated } from "@/lib/isAuthenticated";

export async function POST(req, { params }) {
  try {
    await ConnectDB();
    const { slug } = await params;
    let { text, parentId } = await req.json();

    parentId = parentId ? String(parentId) : null;

    const auth = await isAuthenticated(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return NextResponse.json({ success: false, message: "Parent comment not found" }, { status: 404 });
      }
    }

    const newComment = new Comment({
      text,
      author: auth.user.id,
      blog: blog._id,
      parentId, 
    });

    await newComment.save();
    await newComment.populate("author", "name");

    if (parentId) {
      await Comment.findByIdAndUpdate(
        parentId,
        { $push: { replies: newComment._id } },  
        { new: true }
      );
    }

    return NextResponse.json({ success: true, message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
