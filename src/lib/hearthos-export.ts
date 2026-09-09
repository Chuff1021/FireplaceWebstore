import { createHash, timingSafeEqual } from "node:crypto";

export function validExportToken(header: string | null, secret: string | undefined) {
  if (!secret || secret.length < 32 || !header || header.length > 1024) return false;
  const expected = createHash("sha256").update(`Bearer ${secret}`).digest();
  const received = createHash("sha256").update(header).digest();
  return timingSafeEqual(expected, received);
}
