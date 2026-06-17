import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type AdminSessionPayload = {
  username: string;
  expiresAt: number;
};

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

async function signPayload(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Buffer.from(signature).toString("base64url");
}

async function createToken(payload: AdminSessionPayload) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

async function verifyToken(token: string): Promise<AdminSessionPayload | null> {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = await signPayload(encodedPayload);
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload;
    if (!payload.username || !payload.expiresAt || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    session: {
      id: token,
      userId: 1,
      expiresAt: new Date(payload.expiresAt),
    },
    user: {
      id: 1,
      username: payload.username,
      passwordHash: "",
      createdAt: new Date(),
    },
  };
}

export async function requireAdminAuth() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function createAdminSession(userId: number): Promise<string> {
  void userId;
  return createToken({
    username: "admin",
    expiresAt: Date.now() + SESSION_DURATION_MS,
  });
}

export async function deleteAdminSession(token: string) {
  void token;
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
  return;
}

export async function verifyAdminCredentials(username: string, password: string) {
  return username === "admin" && password === getAdminPassword();
}
