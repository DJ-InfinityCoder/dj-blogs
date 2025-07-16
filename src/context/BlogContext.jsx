"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSentView, setHasSentView] = useState(false);

  const fetchBlog = async (slug) => {
    if (!slug) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/blog-details/${slug}`);
      if (data.success) {
        setBlog(data.blog);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug && !blog) {
      fetchBlog(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (blog && !hasSentView) {
      const timer = setTimeout(() => {
        axios
          .post(`/api/blog-details/${slug}/views`)
          .then(() => setHasSentView(true))
          .catch(() => console.error("Failed to update view count"));
      }, 120000);

      return () => clearTimeout(timer);
    }
  }, [blog, hasSentView, slug]);

  return (
    <BlogContext.Provider value={{ blog, setBlog, loading, fetchBlog }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogDetails = () => {
  return useContext(BlogContext);
};
