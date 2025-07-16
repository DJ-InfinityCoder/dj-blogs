"use client";

import { useRef } from "react";
import BlogHeader from "@/components/blogsSlugComponent/BlogHeader";
import BlogContent from "@/components/blogsSlugComponent/BlogContent";
import CommentSection from "@/components/blogsSlugComponent/CommentSection";
import { useBlogDetails } from "@/context/BlogContext";

import { Loader2 } from "lucide-react";

export default function BlogPage() {
  const { blog, loading } = useBlogDetails();
  const commentSectionRef = useRef(null); 

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 text-lg">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="mt-18 max-w-3xl mx-auto px-6 py-10">
      <BlogHeader commentSectionRef={commentSectionRef} /> 
      <BlogContent />
      <CommentSection ref={commentSectionRef} /> 
    </div>
  );
}
