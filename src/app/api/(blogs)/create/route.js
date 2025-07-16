import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    await ConnectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, slug, thumbnail, category, tags, content } = await req.json();

    if (!title || !slug || !category || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
    }

    // Ensure the category exists or create it
    let categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      categoryDoc = new Category({ name: category });
      await categoryDoc.save();
    }

    const newBlog = new Blog({
      title,
      slug,
      thumbnail,
      category: categoryDoc._id,
      tags,
      content, 
      author: session.user.id,
    });

    await newBlog.save();

    return NextResponse.json({ message: "Blog saved successfully" });
  } catch (error) {
    console.error("Error saving blog:", error);
    return NextResponse.json({ message: "Error saving blog" }, { status: 500 });
  }
}
