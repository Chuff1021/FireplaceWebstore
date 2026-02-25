import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const variant = (formData.get("variant") as string) || "main"; // "main" or "light"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type — allow SVG, PNG, JPG, WebP
    const allowedTypes = [
      "image/svg+xml",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use SVG, PNG, JPG, or WebP." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const ext = extname(file.name) || (file.type === "image/svg+xml" ? ".svg" : ".png");
    const publicDir = join(process.cwd(), "public");

    // Ensure public directory exists
    await mkdir(publicDir, { recursive: true });

    // Determine filename based on variant
    const filename = variant === "light" ? `logo-custom-light${ext}` : `logo-custom${ext}`;
    const filePath = join(publicDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const url = `/${filename}`;
    return NextResponse.json({ url, variant });
  } catch (error) {
    console.error("Logo upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const publicDir = join(process.cwd(), "public");

  // Check for custom logos (any supported extension)
  const extensions = [".svg", ".png", ".jpg", ".jpeg", ".webp"];
  let mainLogo: string | null = null;
  let lightLogo: string | null = null;

  for (const ext of extensions) {
    if (!mainLogo && existsSync(join(publicDir, `logo-custom${ext}`))) {
      mainLogo = `/logo-custom${ext}`;
    }
    if (!lightLogo && existsSync(join(publicDir, `logo-custom-light${ext}`))) {
      lightLogo = `/logo-custom-light${ext}`;
    }
  }

  return NextResponse.json({ mainLogo, lightLogo });
}
