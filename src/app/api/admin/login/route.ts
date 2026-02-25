import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAdminSession, ensureDefaultAdmin, verifyPassword } from "@/lib/admin-auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    // Ensure default admin exists
    await ensureDefaultAdmin();

    // Find user
    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = users[0];
    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session
    const token = await createAdminSession(user.id);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
