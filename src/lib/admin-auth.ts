import { cookies } from "next/headers";
import { db } from "@/db";
import { adminSessions, adminUsers } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const now = new Date();
  const sessions = await db
    .select({ session: adminSessions, user: adminUsers })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(
      and(
        eq(adminSessions.id, token),
        gt(adminSessions.expiresAt, now)
      )
    )
    .limit(1);

  if (sessions.length === 0) return null;
  return sessions[0];
}

export async function requireAdminAuth() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function createAdminSession(userId: number): Promise<string> {
  const token = crypto.randomUUID() + "-" + crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(adminSessions).values({
    id: token,
    userId,
    expiresAt,
  });

  return token;
}

export async function deleteAdminSession(token: string) {
  await db.delete(adminSessions).where(eq(adminSessions.id, token));
}

// Simple password hashing using Web Crypto API (available in Next.js edge/server)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function ensureDefaultAdmin() {
  // Create default admin if none exists
  const existing = await db.select().from(adminUsers).limit(1);
  if (existing.length === 0) {
    const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
    const hash = await hashPassword(defaultPassword);
    await db.insert(adminUsers).values({
      username: "admin",
      passwordHash: hash,
    });
  }
}
