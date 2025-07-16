import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await ConnectDB();

    const categories = await Category.find().select("-_id -__v").lean(); 

    return NextResponse.json(
      { success: true, categories },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching categories:", error.message);

    return NextResponse.json(
      { success: false, message: "Failed to fetch categories." },
      { status: 500 }
    );
  }
}
