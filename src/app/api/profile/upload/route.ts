import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth.actions";
import path from "path";
import fs from "fs/promises";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `profile${path.extname(file.name)}`;
    const userDir = path.join(process.cwd(), "public", "users", user.username);

    // Create directory if it doesn't exist
    await fs.mkdir(userDir, { recursive: true });

    const filePath = path.join(userDir, filename);
    await fs.writeFile(filePath, buffer);

    const relativePath = `/users/${user.username}/${filename}`;

    // Update user in DB
    await dbConnect();
    await User.findByIdAndUpdate(user.id, { profileImage: relativePath });

    return NextResponse.json({ success: true, url: relativePath });
  } catch (error) {
    console.error("[UPLOAD_ERROR]:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
