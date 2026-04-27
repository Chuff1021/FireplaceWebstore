#!/usr/bin/env node

import fs from "fs";
import path from "path";
import crypto from "crypto";
import http from "http";
import https from "https";

const ROOT = process.cwd();
const CSV_PATH = path.join(ROOT, "image-upgrade", "parts-missing-source-photos.csv");
const PUBLIC_PARTS_DIR = path.join(ROOT, "public", "products", "parts");
const LOG_PATH = path.join(ROOT, "image-upgrade", "parts-photo-recovery-full.csv");
const BAD_PLACEHOLDER_PATH = path.join(ROOT, "public", "products", "parts", "rlfp-40dlp.jpg");
const BAD_PLACEHOLDER_HASH = fs.existsSync(BAD_PLACEHOLDER_PATH)
  ? md5(fs.readFileSync(BAD_PLACEHOLDER_PATH))
  : "aeb8c281b62a9e4839c72294b1e463a3";
const USER_AGENT = "Mozilla/5.0 (compatible; AaronsFireplaceBot/1.0; +https://aaronsfireplaceco.com)";
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
const RETRYABLE_ERROR_CODES = new Set(["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN"]);

function parseArgs(argv) {
  const args = { start: 1, limit: Infinity, concurrency: 10, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--start" && value) { args.start = Number(value); i += 1; }
    else if (key === "--limit" && value) { args.limit = Number(value); i += 1; }
    else if (key === "--concurrency" && value) { args.concurrency = Number(value); i += 1; }
    else if (key === "--dry-run") { args.dryRun = true; }
  }
  return args;
}

function md5(buffer) {
  return crypto.createHash("md5").update(buffer).digest("hex");
}

function csvEscape(value = "") {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ""; }
    else if (char === '\n') { row.push(field); rows.push(row); row = []; field = ""; }
    else if (char !== '\r') field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function toSlug(input = "") {
  return input.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function decodeHtml(value = "") {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function requestBuffer(url, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("http://") ? http : https;
    const request = lib.get(url, { headers: { "User-Agent": USER_AGENT, Accept: "*/*" } }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        const redirect = response.headers.location.startsWith("http") ? response.headers.location : new URL(response.headers.location, url).toString();
        requestBuffer(redirect, timeoutMs).then(resolve, reject);
        return;
      }
      if (response.statusCode !== 200) {
        response.resume();
        const error = new Error(`HTTP ${response.statusCode}`);
        error.statusCode = response.statusCode;
        reject(error);
        return;
      }
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(Buffer.concat(chunks)));
    });
    request.setTimeout(timeoutMs, () => request.destroy(Object.assign(new Error("ETIMEDOUT"), { code: "ETIMEDOUT" })));
    request.on("error", reject);
  });
}

async function withRetries(action, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try { return await action(); }
    catch (error) {
      lastError = error;
      if (!RETRYABLE_ERROR_CODES.has(error.code) && !RETRYABLE_STATUS_CODES.has(error.statusCode)) break;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError;
}

async function fetchText(url) {
  return (await withRetries(() => requestBuffer(url, 20000))).toString("utf8");
}

async function fetchImage(url) {
  return withRetries(() => requestBuffer(url, 25000));
}

function extractImageCandidates(html, pageUrl) {
  const candidates = [];
  const add = (raw, source) => {
    if (!raw) return;
    const decoded = decodeHtml(raw.trim());
    if (!decoded || decoded.startsWith("data:")) return;
    try {
      const url = new URL(decoded, pageUrl).toString();
      if (!/^https?:\/\//.test(url)) return;
      candidates.push({ url, source });
    } catch {}
  };

  for (const pattern of [
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/gi,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/gi,
    /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/gi,
    /<link\s+rel=["']image_src["']\s+href=["']([^"']+)["']/gi,
  ]) {
    let match;
    while ((match = pattern.exec(html))) add(match[1], "meta");
  }

  const imgPattern = /<img\b[^>]*(?:src|data-src|data-zoom-image|data-original)=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgPattern.exec(html))) add(match[1], "img");

  return [...new Map(candidates.map((candidate) => [candidate.url, candidate])).values()];
}

function scoreCandidate(candidate, record) {
  const url = candidate.url.toLowerCase();
  const sku = record.sku.toLowerCase();
  const slug = record.slug.toLowerCase();
  let score = 0;

  if (!/\.(jpe?g|png|webp)(\?|$)/i.test(url)) score -= 20;
  if (url.includes("/v/vspfiles/photos/")) score += 30;
  if (url.includes("/products/")) score += 10;
  if (url.includes(sku)) score += 35;
  if (slug && url.includes(slug)) score += 20;
  if (candidate.source === "meta") score += 8;
  if (/(logo|placeholder|no[-_]?image|comingsoon|banner|icon|sprite|facebook|paypal|credit|seal)/i.test(url)) score -= 80;
  if (/(mountain|stove-parts-unlimited|mvh)/i.test(url) && !url.includes(sku)) score -= 50;
  return score;
}

function getExtension(url, buffer) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return ext === ".jpeg" ? ".jpg" : ext;
  const sig = buffer.subarray(0, 12).toString("hex");
  if (sig.startsWith("89504e47")) return ".png";
  if (sig.startsWith("52494646") && buffer.subarray(8, 12).toString() === "WEBP") return ".webp";
  return ".jpg";
}

function loadRows() {
  const [header, ...rows] = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
  const keys = header;
  return rows.filter((row) => row.length === keys.length).map((row, index) => {
    const record = Object.fromEntries(keys.map((key, i) => [key, row[i]]));
    return { ...record, rowNumber: index + 1, index: Number(record.index) };
  });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

function writeJson(file, records) {
  fs.writeFileSync(path.join(ROOT, file), `${JSON.stringify(records, null, 2)}\n`);
}

async function processRecord(record, cache, args) {
  const records = cache.get(record.file) ?? readJson(record.file);
  cache.set(record.file, records);
  const item = records[record.index];
  if (!item) return { ...record, status: "missing-record", reason: "index not found" };
  if (item.imageUrl) return { ...record, status: "already-has-image", imageUrl: item.imageUrl };

  let html;
  try { html = await fetchText(record.productUrl); }
  catch (error) { return { ...record, status: "fetch-error", reason: error.message }; }

  const candidates = extractImageCandidates(html, record.productUrl)
    .map((candidate) => ({ ...candidate, score: scoreCandidate(candidate, record) }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (!candidates.length) return { ...record, status: "no-real-photo", reason: "no positive image candidates" };

  for (const candidate of candidates) {
    try {
      const buffer = await fetchImage(candidate.url);
      if (buffer.length < 1200) continue;
      if (md5(buffer) === BAD_PLACEHOLDER_HASH) continue;

      const ext = getExtension(candidate.url, buffer);
      const filename = `${toSlug(record.sku || record.slug || item.sku || item.slug)}${ext}`;
      const destination = path.join(PUBLIC_PARTS_DIR, filename);
      const imageUrl = `/products/parts/${filename}`;

      if (!args.dryRun) {
        fs.mkdirSync(PUBLIC_PARTS_DIR, { recursive: true });
        fs.writeFileSync(destination, buffer);
        item.imageUrl = imageUrl;
      }

      return { ...record, status: "updated", imageUrl, sourceImageUrl: candidate.url, reason: `score=${candidate.score}` };
    } catch (error) {
      continue;
    }
  }

  return { ...record, status: "no-real-photo", reason: "candidates were placeholders or failed download" };
}

async function runPool(items, concurrency, iterator) {
  let cursor = 0;
  const results = [];
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      const result = await iterator(items[index], index);
      results[index] = result;
      if ((index + 1) % 100 === 0) console.log(`processed ${index + 1}/${items.length}`);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
  return results;
}

function appendLog(results) {
  const exists = fs.existsSync(LOG_PATH);
  const lines = [];
  if (!exists) lines.push(["rowNumber", "sku", "status", "imageUrl", "sourceImageUrl", "reason", "productUrl"].join(","));
  for (const result of results) {
    lines.push([
      result.rowNumber,
      result.sku,
      result.status,
      result.imageUrl || "",
      result.sourceImageUrl || "",
      result.reason || "",
      result.productUrl,
    ].map(csvEscape).join(","));
  }
  fs.appendFileSync(LOG_PATH, `${lines.join("\n")}\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const allRows = loadRows().filter((row) => row.rowNumber >= args.start).slice(0, args.limit);
  const cache = new Map();
  console.log(`recovering ${allRows.length} rows start=${args.start} concurrency=${args.concurrency} dryRun=${args.dryRun}`);
  const results = await runPool(allRows, args.concurrency, (row) => processRecord(row, cache, args));

  if (!args.dryRun) {
    for (const [file, records] of cache.entries()) writeJson(file, records);
  }
  if (!args.dryRun) {
    appendLog(results);
  }

  const counts = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] || 0) + 1;
    return acc;
  }, {});
  console.log(JSON.stringify(counts, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
