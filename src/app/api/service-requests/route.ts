import { NextResponse } from "next/server";
import { db } from "@/db";
import { serviceRequests } from "@/db/schema";

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

    const [created] = await db
      .insert(serviceRequests)
      .values({
        name: clean(payload.name),
        phone: clean(payload.phone),
        email: clean(payload.email),
        applianceType: clean(payload.applianceType),
        serviceType: clean(payload.serviceType),
        requestedDate: clean(payload.requestedDate),
        preferredTime: clean(payload.preferredTime),
        address: clean(payload.address),
        notes: clean(payload.notes),
        status: "new",
      })
      .returning({ id: serviceRequests.id });

    return NextResponse.json({ ok: true, id: created?.id });
  } catch (error) {
    console.error("Failed to create service request", error);
    return NextResponse.json({ error: "Unable to submit service request" }, { status: 500 });
  }
}
