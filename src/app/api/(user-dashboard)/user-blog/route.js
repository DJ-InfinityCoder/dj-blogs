import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import { isAuthenticated } from "@/lib/isAuthenticated";

async function countNestedComments(commentId) {
    const comment = await Comment.findById(commentId).lean();
    if (!comment || !comment.replies.length) return 0;

    let total = comment.replies.length;
    for (const replyId of comment.replies) {
        total += await countNestedComments(replyId);
    }

    return total;
}

export async function GET(req) {
    await ConnectDB();

    const { isAuthenticated: auth, user, message } = await isAuthenticated(req);

    if (!auth) {
        return NextResponse.json({ message }, { status: 401 });
    }

    try {
        const blogs = await Blog.find({ author: user.id })
            .select("title slug category views likes createdAt updatedAt")
            .populate("category", "name")
            .sort({ createdAt: -1 })
            .lean();

        const blogsWithStats = await Promise.all(
            blogs.map(async (blog) => {
                const totalLikes = blog.likes?.length || 0;

                const rootComments = await Comment.find({
                    blog: blog._id,
                    parentId: null,
                }).lean();

                let totalComments = rootComments.length;

                for (const comment of rootComments) {
                    totalComments += await countNestedComments(comment._id);
                }

                return {
                    title: blog.title,
                    slug: blog.slug,
                    category: blog.category?.name || "Uncategorized",
                    views: blog.views || 0,
                    totalLikes,
                    totalComments,
                    createdAt: blog.createdAt,
                    updatedAt: blog.updatedAt,
                };
            })
        );

        return NextResponse.json({ blogs: blogsWithStats }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
