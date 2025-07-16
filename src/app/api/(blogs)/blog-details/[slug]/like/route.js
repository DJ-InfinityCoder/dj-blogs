import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { isAuthenticated } from "@/lib/isAuthenticated";

export async function POST(req, { params }) {
  try {
    await ConnectDB();
    const { slug } = await params;

    const auth = await isAuthenticated(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    const userId = auth.user?.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    const hasLiked = blog.likes.includes(userId);
    const updateQuery = hasLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      updateQuery,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      liked: !hasLiked,
      totalLikes: updatedBlog.likes.length,
    });
  } catch (error) {
    console.error("Error liking blog:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
