
import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/isAuthenticated"
import ConnectDB from "@/lib/db"
import Blog from "@/models/Blog"

export const GET = async (req) => {
  await ConnectDB()

  const { isAuthenticated: isAuth, user } = await isAuthenticated(req)

  if (!isAuth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const blogs = await Blog.find({ author: user.id })

    const totalBlogs = blogs.length
    const totalLikes = blogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0)
    const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0)

    return NextResponse.json({
      stats: {
        totalBlogs,
        totalLikes,
        totalViews,
      },
    })
  } catch (error) {
    console.error("Error fetching blog stats:", error)
    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 })
  }
}
