import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { token } = await request.json();
    await connectDB();

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error verifying email" }, { status: 500 });
  }
}
