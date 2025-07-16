import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import Category from "@/models/Category";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await ConnectDB();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 5;
    const category = url.searchParams.get("category");
    const author = url.searchParams.get("author");
    const tags = url.searchParams.get("tags");
    const search = url.searchParams.get("search");
    const isTrending = url.searchParams.get("trending") === "true";

    const sortField = url.searchParams.get("sortField") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      const categoryDoc = await Category.findOne({ name: category }).select("_id");
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        return NextResponse.json({ success: true, blogs: [], totalCount: 0 });
      }
    }

    if (author) {
      const authorRegex = new RegExp(author, "i");
    
      const matchingAuthors = await User.find({
        name: { $regex: authorRegex },
      }).select("_id");
    
      const authorIds = matchingAuthors.map((a) => a._id);
      if (authorIds.length > 0) {
        filter.author = { $in: authorIds };
      } else {
        filter.author = { $in: [] };
      }
    }
    
    if (tags) {
      const tagList = tags.split(",").map((tag) => tag.trim());
      filter.tags = {
        $in: tagList.map((t) => new RegExp(t, "i")),
      };
    }
    

    if (isTrending) {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
      filter.createdAt = { $gte: fifteenDaysAgo };
    }

    const blogs = await Blog.aggregate([
      { $match: filter },
      {
        $project: {
          title: 1,
          slug: 1,
          tags: 1,
          thumbnail: 1,
          views: 1,
          createdAt: 1,
          author: 1,
          category: 1,
          totalLikes: { $size: "$likes" },
          totalComments: { $size: "$comments" },
        },
      },
      // 🔥 Dynamic sorting!
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);


    await Blog.populate(blogs, { path: "author", select: "name" });
    await Blog.populate(blogs, { path: "category", select: "name" });
    const totalCount = await Blog.countDocuments(filter);

    return NextResponse.json({ success: true, blogs, totalCount });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
