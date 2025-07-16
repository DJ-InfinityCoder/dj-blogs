"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Eye, User, Tag } from "lucide-react";
import { useBlogDetails } from "@/context/BlogContext";
import BlogCard from "@/components/webComponents/BlogCard";

export default function TrendingBlogs({ blogsRef }) {
  const router = useRouter();
  const { fetchBlog } = useBlogDetails();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSlug, setLoadingSlug] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blogs?trending=true");
        setBlogs(response.data.blogs);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleReadMore = async (blog) => {
    setLoadingSlug(blog.slug);
    await fetchBlog(blog.slug);
    router.push(`/blog/${blog.slug}`);
    setLoadingSlug(null);
  };

  return (
    <section
      ref={blogsRef}
      className="py-16 bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex justify-center items-center gap-2">
          🚀 Trending Blogs
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
          Stay ahead with insights from top bloggers around the world.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center mt-8">
          <Loader2
            className="animate-spin text-gray-600 dark:text-gray-300"
            size={32}
          />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-8">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 max-w-6xl mx-auto">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              loadingSlug={loadingSlug}
              onReadMore={handleReadMore}
            />
          ))}
        </div>
      )}
    </section>
  );
}
