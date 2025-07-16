import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/sendMail";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await connectDB();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const user = new User({ email, password: hashedPassword, verificationToken });
    await user.save();

    const verifyLink = `${process.env.NEXT_PUBLIC_URL}/auth/verify-email?token=${verificationToken}`;
    await sendMail(email, "Verify Your Email", `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`);

    return NextResponse.json({ message: "User created. Verification email sent." });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}
