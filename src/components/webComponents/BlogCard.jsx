"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, User, Tag, Loader2 } from "lucide-react";

export default function BlogCard({ blog, loadingSlug, onReadMore }) {
  return (
    <div
      key={blog._id}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 w-full max-w-md mx-auto h-[450px] flex flex-col hover:border-blue-600 dark:hover:border-blue-600"
    >
      <div className="relative rounded-lg overflow-hidden w-full h-[200px]">
        <Image
          src={blog.thumbnail}
          alt={blog.title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg shadow-md border border-gray-300 dark:border-gray-700 "
        />
        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {blog.category.name}
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-between">
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {blog.title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
          <User className="w-4 h-4" />
          <span>{blog.author.name}</span>
        </div>

        <div className="mt-1 flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
          <Eye className="w-4 h-4" />
          <span>{blog.views} Views</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <Button
          variant="outline"
          disabled={loadingSlug === blog.slug}
          className={`${
            loadingSlug === blog.slug
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          } mt-5 w-full border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-300 
                            hover:bg-blue-100 dark:hover:bg-blue-700/50 transition-all duration-300 rounded-lg flex justify-center items-center gap-2`}
          onClick={() => onReadMore(blog)}
        >
          {loadingSlug === blog.slug ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>Read More →</>
          )}
        </Button>
      </div>
    </div>
  );
}
