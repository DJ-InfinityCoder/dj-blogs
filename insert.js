import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import ConnectDB from "./src/lib/db.js"; // update with actual path
import Blog from "./src/models/Blog.js"; // update with actual path
import User from "./src/models/User.js"; // update with actual path
import Category from "./src/models/Category.js"; // update with actual path

dotenv.config();

const insertDummyBlogs = async () => {
  await ConnectDB();

  // Optional cleanup
  await Blog.deleteMany({});
  await User.deleteMany({});
  await Category.deleteMany({});

  // Categories
  const categoryNames = [
    "Technology",
    "Health",
    "Travel",
    "Finance",
    "Education",
    "Lifestyle"
  ];

  const categories = await Promise.all(
    categoryNames.map((name) => Category.create({ name }))
  );

  // Dummy users with hashed password
  const hashedPassword = await bcrypt.hash("123456", 10);
  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      User.create({
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        name: `Dummy User ${i + 1}`,
        provider: "credentials",
      })
    )
  );

  // Example tags
  const tagPool = [
    "coding",
    "wellness",
    "adventure",
    "budgeting",
    "online learning",
    "minimalism",
    "travel hacks",
    "tech trends",
    "mindfulness",
    "remote work"
  ];

  // Create blogs
  const blogs = users.map((user, i) => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const shuffledTags = tagPool.sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, 3); // Exactly 3 tags

    return {
      title: `Sample Blog Post ${i + 1}`,
      slug: `sample-blog-post-${i + 1}`,
      thumbnail: `https://picsum.photos/seed/${i + 1}/600/400`,
      author: user._id,
      category: randomCategory._id,
      content: `# Sample Blog ${i + 1}\nThis is a **Markdown** content written by ${user.name}.`,
      tags: selectedTags,
      views: Math.floor(Math.random() * 100),
      likes: [],
      comments: [],
    };
  });

  await Blog.insertMany(blogs);
  console.log("✅ 10 Dummy users (with hashed passwords), 6 categories, and 10 blogs (3 tags each) inserted successfully!");

  mongoose.connection.close();
};

insertDummyBlogs();
