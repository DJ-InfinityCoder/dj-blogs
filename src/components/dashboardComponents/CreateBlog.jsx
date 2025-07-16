"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@/components/Editor/EditorWrapper";
import MDXRenderer from "@/components/Editor/MDXRenderer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CreateBlogPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState("");
  const [mdxContent, setMdxContent] = useState("");

  const components = {
    Button,
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/blogsCategory");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleSave = async () => {
    const finalCategory = selectedCategory || newCategory.trim();
    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!title || !slug || !finalCategory || !mdxContent) {
      alert("Please fill in all required fields");
      return;
    }

    if (parsedTags.length > 3) {
      alert("You can only add up to 3 tags.");
      return;
    }

    try {
      const res = await axios.post("/api/create", {
        title,
        slug,
        thumbnail,
        category: finalCategory,
        tags: tags.split(",").map((tag) => tag.trim()),
        content: mdxContent,
      });

      alert(res.data.message);
      setTitle("");
      setSlug("");
      setThumbnail("");
      setTags("");
      setMdxContent("");
      setSelectedCategory("");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create blog");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen text-gray-900 dark:text-gray-50">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <div className="max-w-xl">
        <Input
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Thumbnail URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Tags (comma separated, max 3)"
          value={tags}
          onChange={(e) => {
            const input = e.target.value;
            const splitTags = input
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);

            if (splitTags.length <= 3) {
              setTags(input);
            }
          }}
          className="mb-4"
        />

        <Label className="mb-2 block">Select Existing Category</Label>
        <Select
          onValueChange={(val) => {
            setSelectedCategory(val === "_default" ? "" : val);
            setNewCategory("");
          }}
          value={selectedCategory || "_default"}
        >
          <SelectTrigger className="mb-4 w-full">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_default">-- Select a category --</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id || cat.name} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label className="mb-2 block">Or Create New Category</Label>
        <Input
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => {
            setNewCategory(e.target.value);
            setSelectedCategory("");
          }}
          className="mb-6"
          disabled={selectedCategory !== ""}
        />
      </div>

      <Editor content={mdxContent} setContent={setMdxContent} />

      <Button className="mt-4" onClick={handleSave}>
        Save Blog
      </Button>

      <div className="border p-4 mt-6 rounded bg-gray-100 dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <MDXRenderer source={mdxContent} components={components} />
      </div>
    </div>
  );
}
