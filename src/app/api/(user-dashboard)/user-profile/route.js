import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/isAuthenticated"
import ConnectDB from "@/lib/db"
import User from "@/models/User"


export async function GET(req) {
  await ConnectDB()

  const { isAuthenticated: auth, user } = await isAuthenticated(req)
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const dbUser = await User.findOne({ email: user.email }).select("-password -verificationToken")

  if (!dbUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ user: dbUser }, { status: 200 })
}

export async function PATCH(req) {
  await ConnectDB()

  const { isAuthenticated: auth, user } = await isAuthenticated(req)
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const allowedUpdates = ["name", "image"]
  const updates = {}

  allowedUpdates.forEach((key) => {
    if (body[key] !== undefined) updates[key] = body[key]
  })

  const updatedUser = await User.findOneAndUpdate(
    { email: user.email },
    { $set: updates },
    { new: true, select: "-password -verificationToken" }
  )

  if (!updatedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ user: updatedUser, message: "Profile updated successfully" }, { status: 200 })
}
