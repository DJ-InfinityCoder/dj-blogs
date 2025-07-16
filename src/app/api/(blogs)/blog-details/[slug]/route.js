import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import Category from "@/models/Category";

export async function GET(req, { params }) {
  try {
    await ConnectDB();
    const { slug } = await params;

    const blog = await Blog.findOne({ slug })
      .populate("author", "name")
      .populate("category", "name")
      .populate("likes", "name")
      .lean();

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    const allComments = await Comment.find({ blog: blog._id })
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .select("text author createdAt updatedAt likes dislikes parentId replies")
      .lean();

    const commentMap = new Map();

    allComments.forEach((comment) => {
      comment.totalLikes = comment.likes?.length || 0;
      comment.totalDislikes = comment.dislikes?.length || 0;
      comment.replies = [];
      comment.totalReplies = 0;
      commentMap.set(comment._id.toString(), comment);
    });

    let topLevelComments = [];

    allComments.forEach((comment) => {
      if (comment.parentId) {
        const parentComment = commentMap.get(comment.parentId.toString());
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      } else {
        topLevelComments.push(comment);
      }
    });

    function countReplies(comment) {
      let replyCount = comment.replies.length;
      for (const reply of comment.replies) {
        replyCount += countReplies(reply);
      }
      comment.totalReplies = replyCount;
      return replyCount;
    }

    topLevelComments.forEach(countReplies);

    blog.totalLikes = blog.likes.length;
    blog.totalComments = allComments.length;
    blog.totalViews = blog.views;
    blog.comments = topLevelComments;

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}