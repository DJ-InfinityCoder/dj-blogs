import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { format } from "date-fns";
import { useBlogDetails } from "@/context/BlogContext";
import {
  User,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Trash,
  Edit,
  Plus,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CommentSection = ({ ref }) => {
  const { data: session } = useSession();
  const { blog, setBlog } = useBlogDetails();
  const [loading, setLoading] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleSubmitComment = async () => {
    if (!session) {
      toast.error("You must be logged in to comment.");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/api/blog-details/${blog.slug}/comments`,
        { text: commentText }
      );

      if (response.data.success) {
        toast.success("Comment added successfully!");
        setBlog((prev) => ({
          ...prev,
          comments: [
            {
              ...response.data.comment,
              totalLikes: 0,
              totalDislikes: 0,
              totalReplies: 0,
              replies: [],
            },
            ...prev.comments,
          ],
          totalComments: prev.totalComments + 1,
        }));
        setCommentText("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className="mt-10 mb-30 ">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Comments ({blog.totalComments})
      </h2>

      <div className="relative mt-4 mb-7 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 sm:justify-between">
        <Input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
          className="sm:flex-1 p-3 border border-gray-300 dark:border-gray-700
          bg-gray-100 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2
          focus:ring-blue-400 dark:focus:ring-blue-500 transition-all duration-300"
        />
        <Button
          onClick={handleSubmitComment}
          size="sm"
          disabled={loading}
          className={`w-fit cursor-${loading ? "not-allowed" : "pointer"} py-4.5 hover:bg-blue-700 text-white bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300`}
        >
          {loading ? "Posting..." : "Comment"}
        </Button>
      </div>

      {blog.comments.length > 0 ? (
        <div className="mt-4 space-y-6">
          {blog.comments.map(
            (comment) =>
              comment?._id && (
                <Comment
                  key={comment._id}
                  comment={comment}
                  toggleReplies={toggleReplies}
                  expandedReplies={expandedReplies}
                  handleReplyClick={handleReplyClick}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  blogSlug={blog.slug}
                  setBlog={setBlog}
                  loading={loading}
                  setLoading={setLoading}
                />
              )
          )}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          No comments yet.
        </p>
      )}
    </div>
  );
};

const Comment = ({
  comment,
  toggleReplies,
  expandedReplies,
  handleReplyClick,
  replyingTo,
  setReplyingTo,
  blogSlug,
  setBlog,
  loading,
  setLoading,
  isReply = false,
}) => {
  const { data: session } = useSession();
  const [replyText, setReplyText] = useState("");
  const replyInputRef = useRef(null);
  const replyButtonRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const editInputRef = useRef(null);
  const editButtonRef = useRef(null);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  const isAuthor = session?.user?.id === comment?.author?._id;

  useEffect(() => {
    if (session?.user?.id) {
      setUserLiked(comment.likes.includes(session.user.id));
      setUserDisliked(comment.dislikes.includes(session.user.id));
    }
  }, [session, comment.likes, comment.dislikes]);

  const handleReaction = async (commentId, action) => {
    if (!session) {
      toast.error("You must be logged in to react.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/blog-details/${blogSlug}/comments/${commentId}/reaction`,
        { action }
      );

      if (response.data.success) {
        toast.success(`Comment ${action}d successfully!`);

        setUserLiked(response.data.userLiked);
        setUserDisliked(response.data.userDisliked);

        setBlog((prev) => {
          const updateReactions = (comments) =>
            comments.map((c) => {
              if (c._id === commentId) {
                return {
                  ...c,
                  totalLikes: response.data.totalLikes,
                  totalDislikes: response.data.totalDislikes,
                };
              } else if (c.replies && c.replies.length) {
                return { ...c, replies: updateReactions(c.replies) };
              }
              return c;
            });

          return {
            ...prev,
            comments: updateReactions(prev.comments),
          };
        });
      }
    } catch (error) {
      toast.error("Failed to update reaction.");
    }
  };

  const handleReplyButtonClick = (commentId) => {
    setReplyingTo(commentId);
    handleReplyClick(commentId);
    setTimeout(() => {
      replyInputRef.current?.focus();
    }, 100);
  };

  const handleReplySubmit = async () => {
    if (!session) {
      toast.error("You must be logged in to reply.");
      return;
    }

    if (!replyText.trim()) {
      toast.error("Reply to a comment cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/api/blog-details/${blogSlug}/comments`,
        {
          text: replyText,
          parentId: comment._id,
        }
      );

      if (response.data.success) {
        toast.success("Reply added successfully!");
        setBlog((prev) => {
          const addReply = (comments) =>
            comments.map((c) => {
              if (c._id === comment._id) {
                return {
                  ...c,
                  replies: [
                    {
                      ...response.data.comment,
                      totalLikes: 0,
                      totalDislikes: 0,
                      totalReplies: 0,
                      replies: [],
                    },
                    ...c.replies,
                  ],
                  totalReplies: (c.totalReplies || 0) + 1,
                };
              } else if (c.replies && c.replies.length) {
                return { ...c, replies: addReply(c.replies) };
              }
              return c;
            });

          return {
            ...prev,
            comments: addReply(prev.comments),
            totalComments: prev.totalComments + 1,
          };
        });

        setReplyText("");
        if (session) setReplyingTo(null);
        if (!expandedReplies[comment._id]) {
          toggleReplies(comment._id);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reply.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        session &&
        replyingTo === comment._id &&
        replyInputRef.current &&
        !replyInputRef.current.contains(event.target) &&
        replyButtonRef.current &&
        !replyButtonRef.current.contains(event.target)
      ) {
        setReplyingTo(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [replyingTo]);

  const handleEdit = async () => {
    if (!editText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    if (editText === comment.text) {
      toast.info("No changes detected.");
      return;
    }

    try {
      const response = await axios.put(
        `/api/blog-details/${blogSlug}/comments/${comment._id}`,
        { text: editText }
      );

      if (response.data.success) {
        toast.success("Comment updated successfully!");
        setBlog((prev) => {
          const updateComment = (comments) =>
            comments.map((c) => {
              if (c._id === comment._id) {
                return {
                  ...c,
                  text: editText,
                  updatedAt: new Date().toISOString(),
                };
              } else if (c.replies && c.replies.length) {
                return { ...c, replies: updateComment(c.replies) };
              }
              return c;
            });

          return {
            ...prev,
            comments: updateComment(prev.comments),
          };
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update comment.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/blog-details/${blogSlug}/comments/${comment._id}`
      );

      if (response.data.success) {
        toast.success("Comment deleted successfully!");

        setBlog((prev) => {
          const removeComment = (comments) => {
            return comments
              .filter((c) => c._id !== comment._id)
              .map((c) => ({
                ...c,
                replies: removeComment(c.replies || []),
                totalReplies: Math.max(
                  0,
                  c.totalReplies - response.data.deletedCount
                ),
              }));
          };

          return {
            ...prev,
            comments: removeComment(prev.comments),
            totalComments: Math.max(
              0,
              prev.totalComments - response.data.deletedCount
            ),
          };
        });
      }
    } catch (error) {
      toast.error("Failed to delete comment.");
    }
  };

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
    const handleClickOutside = (event) => {
      if (
        isEditing &&
        editInputRef.current &&
        !editInputRef.current.contains(event.target) &&
        editButtonRef.current &&
        !editButtonRef.current.contains(event.target)
      ) {
        setIsEditing(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isEditing]);

  return (
    <div
      className={`relative ${
        isReply
          ? "ml-2 sm:ml-11 pl-3 text-sm border-l-2 border-gray-300 dark:border-gray-700 rounded-bl-xl"
          : "border-b-2 pb-2"
      }`}
    >
      {isAuthor && (
        <div className="absolute top-2 right-0 sm:right-2 flex">
          {isEditing ? (
            <>
              <Button
                ref={editButtonRef}
                variant="ghost"
                size="sm"
                className="text-green-600 cursor-pointer hover:text-green-600"
                onClick={handleEdit}
              >
                <Check className="w-4 h-4" /> Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 cursor-pointer hover:text-red-600"
                onClick={() => setIsEditing(false)}
              >
                <X className="w-4 h-4" /> Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                ref={editButtonRef}
                variant="ghost"
                size="sm"
                className="text-orange-600 hover:text-orange-600 dark:text-orange-400 flex items-center gap-1 cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-600 cursor-pointer dark:text-red-500 flex items-center gap-1"
                onClick={handleDelete}
              >
                <Trash className="w-4 h-4" /> Delete
              </Button>
            </>
          )}
        </div>
      )}

      <div className="flex items-start gap-3 w-full">
        <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400" />
        <div className="flex-1">
          <span
            className={`font-semibold text-gray-900 dark:text-gray-100 ${
              isReply ? "text-sm" : "text-base"
            }`}
          >
            {comment.author?.name || "Anonymous"}
          </span>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(comment.updatedAt), "MMM dd, yyyy hh:mm a")}
          </p>

          {isEditing ? (
            <Input
              ref={editInputRef}
              type="text"
              className="mt-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEdit();
                if (e.key === "Escape") setIsEditing(false);
              }}
            />
          ) : (
            <p
              className={`break-words whitespace-pre-wrap max-w-full mt-1 text-gray-800 dark:text-gray-300 ${
                isReply ? "text-sm" : "text-base"
              }`}
            >
              {comment.text}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-0.5 sm:gap-4 text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center hover:text-blue-600 dark:hover:text-blue-400 gap-1 cursor-pointer ${
                userLiked ? "text-blue-600 dark:text-blue-400" : ""
              }`}
              onClick={() => handleReaction(comment._id, "like")}
            >
              <ThumbsUp className={`w-4 h-4`} />
              {comment.totalLikes}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center hover:text-red-500 dark:hover:text-red-400 gap-1 cursor-pointer ${
                userDisliked ? "text-red-500 dark:text-red-400" : ""
              }`}
              onClick={() => handleReaction(comment._id, "dislike")}
            >
              <ThumbsDown className={`w-4 h-4`} />
              {comment.totalDislikes}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => toggleReplies(comment._id)}
            >
              <MessageSquare className="w-4 h-4" />
              {comment.totalReplies} Replies
            </Button>

            <Button
              ref={replyButtonRef}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
              onClick={() => handleReplyButtonClick(comment._id)}
            >
              <Plus className="w-4 h-4" /> Reply
            </Button>
          </div>

          {replyingTo === comment._id && (
            <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Input
                type="text"
                ref={replyInputRef}
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
                className="sm:flex-1 w-full text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
              />
              <Button
                onClick={handleReplySubmit}
                size="sm"
                disabled={loading}
                className={`text-white bg-blue-600 dark:bg-blue-500 cursor-${loading ? "not-allowed" : "pointer"} py-2 sm:py-4.5 hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300`}
              >
                 {loading ? "Posting..." : "Reply"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {expandedReplies[comment._id] && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(
            (reply) =>
              reply?._id && (
                <Comment
                  key={reply._id}
                  comment={reply}
                  toggleReplies={toggleReplies}
                  expandedReplies={expandedReplies}
                  handleReplyClick={handleReplyClick}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  blogSlug={blogSlug}
                  setBlog={setBlog}
                  loading={loading}
                  setLoading={setLoading}
                  isReply
                />
              )
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
