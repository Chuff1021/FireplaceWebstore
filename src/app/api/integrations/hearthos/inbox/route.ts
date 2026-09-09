import { get, list } from "@vercel/blob";
import { validExportToken } from "@/lib/hearthos-export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "private, no-store" };

// Read-only, prefix-limited connection. Never expose the Blob credential to HearthOS.
export async function GET(request: Request) {
  if (!validExportToken(request.headers.get("authorization"), process.env.HEARTHOS_INBOX_EXPORT_SECRET)) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  }
  const cursor = new URL(request.url).searchParams.get("cursor") || undefined;
  if (cursor && cursor.length > 2048) return Response.json({ error: "Invalid cursor" }, { status: 400, headers });
  try {
    const page = await list({ prefix: "customer-inbox/", limit: 10, cursor });
    const items: unknown[] = [];
    for (const entry of page.blobs) {
      if (!entry.pathname.startsWith("customer-inbox/") || entry.size > 512_000) throw new Error("Invalid inbox object");
      const object = await get(entry.pathname, { access: "private", useCache: false });
      if (!object || object.statusCode !== 200) throw new Error("Inbox object unavailable");
      items.push(JSON.parse(await new Response(object.stream).text()));
    }
    return Response.json({ version: 1, items, nextCursor: page.hasMore ? page.cursor : null }, { headers });
  } catch {
    // Do not return a partial page: the consumer must not advance past unread records.
    console.warn("[hearthos-inbox-export] Read failed");
    return Response.json({ error: "Website inbox export unavailable" }, { status: 503, headers });
  }
}
