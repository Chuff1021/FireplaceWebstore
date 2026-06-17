import { get, list, put } from "@vercel/blob";

export type InboxItemType = "contact" | "order" | "service";
export type InboxStatus = "new" | "read";

export type InboxItem = {
  id: string;
  type: InboxItemType;
  status: InboxStatus;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  total?: number;
  items?: Array<{
    name: string;
    sku?: string;
    quantity: number;
    price: number;
  }>;
  metadata?: Record<string, string>;
};

const INBOX_PREFIX = "customer-inbox/";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 4000) : "";
}

function cleanMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;

  const entries = Object.entries(value)
    .slice(0, 40)
    .map(([key, entryValue]) => {
      let rendered = "";

      if (typeof entryValue === "string") {
        rendered = entryValue;
      } else if (typeof entryValue === "number" || typeof entryValue === "boolean") {
        rendered = String(entryValue);
      } else if (entryValue) {
        rendered = JSON.stringify(entryValue);
      }

      return [clean(key).slice(0, 80), clean(rendered)] as const;
    })
    .filter(([key, entryValue]) => key && entryValue);

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function cleanMoney(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getPath(item: Pick<InboxItem, "createdAt" | "id" | "type">) {
  const date = item.createdAt.slice(0, 10);
  return `${INBOX_PREFIX}${date}/${item.type}-${item.createdAt.replace(/[:.]/g, "-")}-${item.id}.json`;
}

export function createInboxItem(input: Partial<InboxItem> & { type: InboxItemType }): InboxItem {
  return {
    id: crypto.randomUUID(),
    type: input.type,
    status: input.status || "new",
    createdAt: new Date().toISOString(),
    name: clean(input.name),
    email: clean(input.email),
    phone: clean(input.phone),
    subject: clean(input.subject),
    message: clean(input.message),
    total: cleanMoney(input.total),
    items: Array.isArray(input.items)
      ? input.items.slice(0, 50).map((item) => ({
          name: clean(item.name),
          sku: clean(item.sku) || undefined,
          quantity: typeof item.quantity === "number" ? item.quantity : 1,
          price: typeof item.price === "number" ? item.price : 0,
        }))
      : undefined,
    metadata: cleanMetadata(input.metadata),
  };
}

export async function saveInboxItem(item: InboxItem) {
  await put(getPath(item), JSON.stringify(item, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });
}

async function readInboxItem(pathname: string): Promise<InboxItem | null> {
  const blob = await get(pathname, { access: "private", useCache: false });
  if (!blob || blob.statusCode !== 200) return null;

  const text = await new Response(blob.stream).text();
  return JSON.parse(text) as InboxItem;
}

export async function listInboxItems(limit = 100) {
  const { blobs } = await list({ prefix: INBOX_PREFIX, limit });
  const items = await Promise.all(blobs.map((blob) => readInboxItem(blob.pathname)));

  return items
    .filter((item): item is InboxItem => Boolean(item))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
