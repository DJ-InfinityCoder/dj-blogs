"use client";

import { useBlogDetails } from "@/context/BlogContext";
import { useTheme } from "@/context/theme-context";
import MDXRenderer from "@/components/Editor/MDXRenderer"; 
const BlogContent = () => {
  const { blog, loading } = useBlogDetails();
  const { theme } = useTheme();

  if (loading) {
    return <p className="text-center text-gray-500">Loading blog...</p>;
  }

  if (!blog) {
    return <p className="text-center text-red-500">Blog not found.</p>;
  }

  return (
    <div className="BlogContent">
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full h-64 object-cover mt-6 rounded-lg shadow-md"
      />
      <div
        className={`mt-6 text-justify ${
          theme === "dark" ? "prose-invert" : "text-gray-800"
        }`}
      >
        <MDXRenderer source={blog.content} />
      </div>
    </div>
  );
};

export default BlogContent;
