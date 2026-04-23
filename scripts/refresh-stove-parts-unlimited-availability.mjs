#!/usr/bin/env node

/**
 * Re-fetches every Stove Parts Unlimited (Mountain View Hearth) product
 * page and updates ONLY the live fields in each data/parts/stove-parts-unlimited-batch-*.json:
 *
 *   price, salePrice, compareAtPrice, priceDisplay, availability, inStock, stock
 *
 * Image URLs, descriptions, slugs, names, breadcrumbs, etc. are left
 * untouched — this is a stock-refresh pass only.
 *
 * Usage:
 *   node scripts/refresh-stove-parts-unlimited-availability.mjs
 *     --start 0         # batch-file index to start from (sorted)
 *     --limit 9999      # how many batch files to process
 *     --concurrency 8   # parallel product fetches per batch
 *     --sku-contains X  # optional: skip products whose SKU does not include X
 *
 * The script is restartable: re-running touches each batch file at most
 * once per pass and the atomic rewrite happens only after all products
 * in that batch have been probed.
 */

import fs from "fs";
import path from "path";
import https from "https";

const ROOT = process.cwd();
const PARTS_DIR = path.join(ROOT, "data", "parts");

const RETRYABLE_ERROR_CODES = new Set(["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN"]);
const RETRYABLE_STATUS_CODES = [408, 425, 429, 500, 502, 503, 504];

function parseArgs(argv) {
  const args = { start: 0, limit: 9999, concurrency: 8, skuContains: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const v = argv[i];
    const n = argv[i + 1];
    if (v === "--start" && n) { args.start = Number.parseInt(n, 10) || 0; i += 1; }
    else if (v === "--limit" && n) { args.limit = Number.parseInt(n, 10) || args.limit; i += 1; }
    else if (v === "--concurrency" && n) { args.concurrency = Number.parseInt(n, 10) || args.concurrency; i += 1; }
    else if (v === "--sku-contains" && n) { args.skuContains = n; i += 1; }
  }
  return args;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error) {
  const code = String(error?.code || "");
  const msg = String(error?.message || "");
  return (
    RETRYABLE_ERROR_CODES.has(code) ||
    RETRYABLE_STATUS_CODES.some((status) => msg.includes(`HTTP ${status}`))
  );
}

function fetchUrl(url, attempt = 0) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
        timeout: 25_000,
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          resolve(fetchUrl(new URL(res.headers.location, url).toString(), attempt));
          return;
        }
        if (res.statusCode && res.statusCode >= 400) {
          res.resume();
          const err = new Error(`HTTP ${res.statusCode} for ${url}`);
          err.statusCode = res.statusCode;
          reject(err);
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      }
    );
    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy(new Error(`Request timeout for ${url}`));
    });
  }).catch(async (error) => {
    if (attempt < 3 && isRetryableError(error)) {
      await wait(500 * (attempt + 1));
      return fetchUrl(url, attempt + 1);
    }
    throw error;
  });
}

function matchFirst(text, pattern) {
  const m = text.match(pattern);
  return m ? m[1] : "";
}

function decodeHtml(value = "") {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(value = "") {
  return decodeHtml(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function parseBcDataJson(html) {
  const jsonText = matchFirst(html, /var BCData = ({[\s\S]*?});/);
  if (!jsonText) return null;
  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

function parseLiveFields(html) {
  const bc = parseBcDataJson(html) ?? {};
  const price = Number(bc?.product_attributes?.price?.without_tax?.value ?? 0);
  const compareAt = Number(bc?.product_attributes?.price?.rrp_without_tax?.value ?? 0);
  const callForPriceMessage = bc?.product_attributes?.call_for_price_message ?? null;
  const priceDisplay =
    callForPriceMessage || bc?.product_attributes?.price?.without_tax?.formatted || "";
  const stock = bc?.product_attributes?.stock ?? null;
  const inStock = Boolean(bc?.product_attributes?.instock);
  const availability = decodeHtml(
    stripHtml(
      matchFirst(
        html,
        /<span class="productView-info-name">Availability:<\/span>\s*<span class="productView-info-value">([\s\S]*?)<\/span>/
      )
    )
  );

  return {
    price,
    salePrice: compareAt > price ? price : undefined,
    compareAtPrice: compareAt > price ? compareAt : undefined,
    priceDisplay,
    availability,
    inStock,
    stock,
  };
}

async function runPool(items, concurrency, iterator) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor;
      cursor += 1;
      results[i] = await iterator(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => worker()));
  return results;
}

function applyLiveFields(record, live) {
  // Only overwrite live availability fields. Keep everything else intact.
  const next = { ...record };
  if (typeof live.price === "number" && Number.isFinite(live.price) && live.price > 0) {
    next.price = live.price;
  }
  if (typeof live.salePrice === "number" && Number.isFinite(live.salePrice)) {
    next.salePrice = live.salePrice;
  } else {
    delete next.salePrice;
  }
  if (typeof live.compareAtPrice === "number" && Number.isFinite(live.compareAtPrice)) {
    next.compareAtPrice = live.compareAtPrice;
  } else {
    delete next.compareAtPrice;
  }
  if (live.priceDisplay) next.priceDisplay = live.priceDisplay;
  if (live.availability) next.availability = live.availability;
  next.inStock = Boolean(live.inStock);
  next.stock = live.stock ?? null;
  return next;
}

async function refreshBatch(file, concurrency, skuFilter) {
  const full = path.join(PARTS_DIR, file);
  const records = JSON.parse(fs.readFileSync(full, "utf8"));
  if (!Array.isArray(records)) return { file, touched: 0, skipped: 0, errors: 0 };

  const indices = [];
  for (let i = 0; i < records.length; i += 1) {
    const r = records[i];
    if (!r?.productUrl) continue;
    if (skuFilter && !(r.sku || "").toLowerCase().includes(skuFilter.toLowerCase())) continue;
    indices.push(i);
  }

  let touched = 0;
  let errors = 0;

  await runPool(indices, concurrency, async (idx) => {
    const rec = records[idx];
    try {
      const html = await fetchUrl(rec.productUrl);
      const live = parseLiveFields(html);
      records[idx] = applyLiveFields(rec, live);
      touched += 1;
    } catch (err) {
      errors += 1;
      if (err?.statusCode === 404) {
        // Leave the record as-is; a 404 means the source page has been retired.
      } else {
        console.warn(`warn ${rec.sku} ${rec.productUrl} -> ${err.message}`);
      }
    }
  });

  fs.writeFileSync(full, `${JSON.stringify(records, null, 2)}\n`);
  return { file, touched, skipped: records.length - indices.length, errors };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(PARTS_DIR)) {
    console.error(`Missing parts dir: ${PARTS_DIR}`);
    process.exit(1);
  }

  const batches = fs
    .readdirSync(PARTS_DIR)
    .filter((f) => f.startsWith("stove-parts-unlimited-batch-") && f.endsWith(".json"))
    .sort();

  const slice = batches.slice(args.start, args.start + args.limit);
  console.log(
    `Refreshing ${slice.length} batch files (start=${args.start}, limit=${args.limit}, concurrency=${args.concurrency}${args.skuContains ? `, sku-contains=${args.skuContains}` : ""})`
  );

  const startedAt = Date.now();
  let totalTouched = 0;
  let totalErrors = 0;

  for (const file of slice) {
    const { touched, skipped, errors } = await refreshBatch(file, args.concurrency, args.skuContains);
    totalTouched += touched;
    totalErrors += errors;
    console.log(
      `  ${file} -> touched=${touched} skipped=${skipped} errors=${errors}`
    );
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(
    `Done. touched=${totalTouched} errors=${totalErrors} elapsed=${elapsed}s over ${slice.length} batch file(s).`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
