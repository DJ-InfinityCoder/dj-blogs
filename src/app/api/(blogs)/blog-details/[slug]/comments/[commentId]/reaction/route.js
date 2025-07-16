import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import { isAuthenticated } from "@/lib/isAuthenticated";

export async function POST(req, { params }) {
    try {
        await ConnectDB();
        const { commentId } = await params;
        const { action } = await req.json();

        const auth = await isAuthenticated(req);
        if (!auth.isAuthenticated) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
        }

        const userId = auth.user.id;
        if (action === "like") {
            if (comment.likes.includes(userId)) {
                comment.likes.pull(userId);
            } else {
                comment.likes.push(userId);
                comment.dislikes.pull(userId);
            }
        } else if (action === "dislike") {
            if (comment.dislikes.includes(userId)) {
                comment.dislikes.pull(userId);
            } else {
                comment.dislikes.push(userId);
                comment.likes.pull(userId);
            }
        } else {
            return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
        }

        await comment.save();

        return NextResponse.json({
            success: true,
            message: `Comment ${action}d successfully`,
            totalLikes: comment.likes.length,
            totalDislikes: comment.dislikes.length,
            userLiked: comment.likes.includes(userId),
            userDisliked: comment.dislikes.includes(userId),
        });
    } catch (error) {
        console.error(`Error ${action}ing comment:`, error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
