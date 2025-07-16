import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import { isAuthenticated } from "@/lib/isAuthenticated";

export async function PUT(req, { params }) {
    try {
        await ConnectDB();
        const { commentId } = await params;
        const { text } = await req.json();

        const auth = await isAuthenticated(req);
        if (!auth.isAuthenticated) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
        }

        if (comment.author.toString() !== auth.user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized to edit this comment" }, { status: 403 });
        }

        comment.text = text;
        await comment.save();

        return NextResponse.json({ success: true, message: "Comment updated successfully" });
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    try {
        await ConnectDB();
        const { commentId } = await params;

        const auth = await isAuthenticated(req);
        if (!auth.isAuthenticated) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
        }

        if (comment.author.toString() !== auth.user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized to delete this comment" }, { status: 403 });
        }

        const deleteCommentAndReplies = async (commentId) => {
            const comment = await Comment.findById(commentId);
            if (!comment) return 0;

            let deletedCount = 1; // Start with the current comment

            if (comment.replies && comment.replies.length > 0) {
                for (const replyId of comment.replies) {
                    deletedCount += await deleteCommentAndReplies(replyId); // Recursively delete replies
                }
            }

            await Comment.findByIdAndDelete(commentId); // Delete the comment
            return deletedCount;
        };

        const totalDeleted = await deleteCommentAndReplies(commentId);

        if (comment.parentId) {
            await Comment.findByIdAndUpdate(comment.parentId, {
                $pull: { replies: comment._id },
                $inc: { totalReplies: -totalDeleted }
            });
        }

        await Blog.findOneAndUpdate({ slug: comment.blogSlug }, { $inc: { totalComments: -totalDeleted } });

        return NextResponse.json({ success: true, message: "Comment deleted successfully", deletedCount: totalDeleted });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
