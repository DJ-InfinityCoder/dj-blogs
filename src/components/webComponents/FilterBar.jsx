"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const sortOptions = [
  { value: "createdAt", label: "Newest" },
  { value: "views", label: "Most Viewed" },
  { value: "totalLikes", label: "Most Liked" },
];

export default function FilterBar({ filters, onChange }) {
  const [categories, setCategories] = useState([]);
  const pathname = usePathname();
  const isAllCategoriesPage = pathname.includes("/blogs/allcategories");

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [authorInput, setAuthorInput] = useState(filters.author || "");
  const [tagsInput, setTagsInput] = useState(filters.tags || "");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/blogsCategory");
        if (res.data.success) setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border dark:border-gray-600 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
        <div>
          <Label
            htmlFor="search"
            className="text-sm text-zinc-600 dark:text-zinc-300"
          >
            Search Blog
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="search"
              placeholder="Search blogs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="dark:border-gray-600"
            />
            <Button
              className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
              onClick={() => onChange("search", searchInput)}
            >
              Search
            </Button>
          </div>
        </div>

        {isAllCategoriesPage && (
          <div>
            <Label className="text-sm text-zinc-600 dark:text-zinc-300">
              Category
            </Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(val) =>
                onChange("category", val === "all" ? "" : val)
              }
            >
              <SelectTrigger className="mt-1 w-full dark:border-gray-600">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label
            htmlFor="author"
            className="text-sm text-zinc-600 dark:text-zinc-300"
          >
            Search by Author
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="author"
              placeholder="Author name"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              className="dark:border-gray-600"
            />
            <Button
              className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
              onClick={() => onChange("author", authorInput)}
            >
              Search
            </Button>
          </div>
        </div>

        <div>
          <Label
            htmlFor="tags"
            className="text-sm text-zinc-600 dark:text-zinc-300"
          >
            Search by Tags
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="tags"
              placeholder="e.g. javascript, react"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="dark:border-gray-600"
            />
            <Button
              className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
              onClick={() => onChange("tags", tagsInput)}
            >
              Search
            </Button>
          </div>
        </div>

        <div className="flex items-center h-10 gap-2 mt-3 sm:mt-0">
          <Checkbox
            id="trending"
            className="dark:border-gray-600"
            checked={filters.trending}
            onCheckedChange={(checked) => onChange("trending", checked)}
          />
          <Label
            htmlFor="trending"
            className="text-sm text-zinc-600 dark:text-zinc-300"
          >
            Trending
          </Label>
        </div>

        <div>
          <Label className="text-sm text-zinc-600 dark:text-zinc-300">
            Sort By
          </Label>
          <Select
            value={filters.sortField}
            onValueChange={(val) => onChange("sortField", val)}
          >
            <SelectTrigger className="mt-1 w-full dark:border-gray-600">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-zinc-600 dark:text-zinc-300">
            Order
          </Label>
          <Select
            value={filters.sortOrder}
            onValueChange={(val) => onChange("sortOrder", val)}
          >
            <SelectTrigger className="mt-1 w-full dark:border-gray-600">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
