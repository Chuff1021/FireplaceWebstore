import { NextResponse } from "next/server";
import { createInboxItem, saveInboxItem, type InboxItemType } from "@/lib/customer-inbox";

const allowedTypes = new Set<InboxItemType>(["contact", "order", "service"]);

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const type = payload?.type as InboxItemType;

    if (!allowedTypes.has(type)) {
      return NextResponse.json({ error: "Invalid inbox item type" }, { status: 400 });
    }

    if (!clean(payload.name) || (!clean(payload.email) && !clean(payload.phone))) {
      return NextResponse.json({ error: "Name and either email or phone are required" }, { status: 400 });
    }

    const item = createInboxItem({
      type,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      subject: payload.subject,
      message: payload.message,
      total: payload.total,
      items: payload.items,
      metadata: payload.metadata,
    });

    await saveInboxItem(item);
    return NextResponse.json({ ok: true, id: item.id });
  } catch (error) {
    console.error("Failed to save customer inbox item", error);
    return NextResponse.json({ error: "Unable to submit request" }, { status: 500 });
  }
}
