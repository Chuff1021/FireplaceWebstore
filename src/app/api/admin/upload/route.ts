import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    // Generate unique filename
    const ext = extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(join(uploadDir, filename), buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
