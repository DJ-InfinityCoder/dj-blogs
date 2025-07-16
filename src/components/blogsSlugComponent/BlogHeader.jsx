"use client";

import { useState, useEffect } from "react";
import { useBlogDetails } from "@/context/BlogContext";
import { useSession } from "next-auth/react";
import { User, Tag, Eye, Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BlogHeader = ({ commentSectionRef }) => {
  const { blog, setBlog } = useBlogDetails();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (session?.user && blog?.likes) {
        setIsLiked(blog.likes.some(like => like._id === session.user.id));
    }
  }, [session, blog?.likes]);

  const handleLike = async () => {
    if (!session) {
      toast.error("You must be logged in to like the blog!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`/api/blog-details/${blog.slug}/like`);
      if (response.data.success) {
        setBlog((prev) => ({
          ...prev,
          totalLikes: response.data.totalLikes,
        }));
        setIsLiked(response.data.liked); 
        toast.success(response.data.liked ? "Liked the blog!" : "Unliked the blog!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleScrollToComments = () => {
    if (commentSectionRef?.current) {
      const offset = 40;
      const topPosition =
        commentSectionRef.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: topPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="w-full flex sm:flex-row items-center justify-between">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          {blog.title}
        </h1>
        <span className="w-fit h-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-sm font-medium rounded-md">
          {blog.category?.name}
        </span>
      </div>

      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <User className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        <span className="text-base font-medium">
          Posted by:{" "}
          <span className="text-gray-900 dark:text-white">{blog.author?.name}</span>
        </span>
      </div>

      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs rounded-full"
            >
              <Tag className="w-3 h-3 text-blue-700 dark:text-blue-300" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-700 dark:text-gray-400 border-t pt-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          <span className="text-sm font-medium">{blog.totalViews} Views</span>
        </div>

        <button
          onClick={handleLike}
          disabled={loading}
          className={`cursor-pointer hover:fill-red-500 hover:text-red-500 flex items-center gap-2 transition disabled:opacity-50 ${ isLiked ? "text-red-500": ""}`}
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked ? "fill-red-500 text-red-500" : "text-red-500 stroke-red-500"
            }`}
          />
          <span className="text-sm font-medium">{blog.totalLikes} Likes</span>
        </button>

        <div
          className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
          onClick={handleScrollToComments}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{blog.totalComments} Comments</span>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
