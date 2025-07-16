"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "@/components/webComponents/BlogCard";
import FilterBar from "@/components/webComponents/FilterBar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useBlogDetails } from "@/context/BlogContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const BlogsPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const { fetchBlog } = useBlogDetails();
  const [loadingSlug, setLoadingSlug] = useState(null);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    tags: "",
    search: "",
    trending: false,
    sortField: "createdAt",
    sortOrder: "desc",
  });

  const totalPages = Math.ceil(totalCount / limit);

  const handleReadMore = async (blog) => {
    setLoadingSlug(blog.slug);
    await fetchBlog(blog.slug);
    router.push(`/blog/${blog.slug}`);
    setLoadingSlug(null);
  };

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const params = { page, limit };
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== "" &&
          value !== false &&
          value !== null &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          params[key] = key === "trending" ? "true" : value;
        }
      });

      const res = await axios.get("/api/blogs", { params });
      setBlogs(res.data.blogs || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === page;

      pageNumbers.push(
        <PaginationItem key={i}>
          <Button
            variant={isActive ? "outline" : "ghost"}
            onClick={() => setPage(i)}
            className={`h-8 cursor-pointer hover:text-blue-600 mx-1 px-3 text-sm ${
              isActive
                ? "border border-blue-600 text-blue-600 font-semibold"
                : "border text-muted-foreground"
            }`}
          >
            {i}
          </Button>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="mt-18 max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-zinc-700 dark:text-gray-300 text-center mb-8">
        All Blogs Category
      </h1>

      <FilterBar filters={filters} onChange={handleFilterChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="col-span-3 flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              loadingSlug={loadingSlug}
              onReadMore={handleReadMore}
            />
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No blogs found.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className={`h-8 px-3 text-sm rounded border mr-1 transition-colors
              ${
                page === 1
                  ? "text-blue-600 cursor-not-allowed opacity-50"
                  : "text-blue-600 hover:border-blue-600 cursor-pointer"
              }`}
                >
                  Previous
                </button>
              </PaginationItem>

              {renderPageNumbers()}

              <PaginationItem>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`h-8 px-3 text-sm rounded border transition-colors
              ${
                page === totalPages
                  ? "text-blue-600 cursor-not-allowed opacity-50"
                  : "text-blue-600 hover:border-blue-600 cursor-pointer"
              }`}
                >
                  Next
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
