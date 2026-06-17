import { NextResponse } from "next/server";
import { createInboxItem, saveInboxItem } from "@/lib/customer-inbox";

const requiredFields = ["name", "phone", "applianceType", "serviceType", "requestedDate", "preferredTime"] as const;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const missing = requiredFields.filter((field) => !clean(payload?.[field]));

    if (missing.length > 0) {
      return NextResponse.json({ error: "Missing required fields", fields: missing }, { status: 400 });
    }

    const item = createInboxItem({
      type: "service",
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      subject: `${clean(payload.serviceType)} - ${clean(payload.applianceType)}`,
      message: clean(payload.notes),
      metadata: {
        applianceType: clean(payload.applianceType),
        serviceType: clean(payload.serviceType),
        requestedDate: clean(payload.requestedDate),
        preferredTime: clean(payload.preferredTime),
        address: clean(payload.address),
      },
    });

    await saveInboxItem(item);
    return NextResponse.json({ ok: true, id: item.id });
  } catch (error) {
    console.error("Failed to create service request", error);
    return NextResponse.json({ error: "Unable to submit service request" }, { status: 500 });
  }
}
