#!/usr/bin/env node

import fs from "fs";
import path from "path";
import https from "https";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const PARTS_DIR = path.join(DATA_DIR, "parts");
const PUBLIC_PARTS_DIR = path.join(ROOT, "public", "products", "parts");
const MANIFEST_PATH = path.join(DATA_DIR, "stove-parts-unlimited-import-manifest.json");
const PRODUCT_SITEMAPS = [1, 2, 3, 4].map(
  (page) => `https://www.stove-parts-unlimited.com/xmlsitemap.php?type=products&page=${page}`
);
const RETRYABLE_ERROR_CODES = new Set(["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN"]);
const RETRYABLE_STATUS_CODES = [408, 425, 429, 500, 502, 503, 504];

function parseArgs(argv) {
  const args = {
    start: 0,
    limit: 100,
    concurrency: 6,
    batchName: "",
    downloadImages: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    const next = argv[index + 1];

    if (value === "--start" && next) {
      args.start = Number.parseInt(next, 10) || 0;
      index += 1;
    } else if (value === "--limit" && next) {
      args.limit = Number.parseInt(next, 10) || args.limit;
      index += 1;
    } else if (value === "--concurrency" && next) {
      args.concurrency = Number.parseInt(next, 10) || args.concurrency;
      index += 1;
    } else if (value === "--batch-name" && next) {
      args.batchName = next;
      index += 1;
    } else if (value === "--skip-images") {
      args.downloadImages = false;
    }
  }

  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
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

function toSlug(input = "") {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchFirst(text, pattern) {
  const match = text.match(pattern);
  return match ? match[1] : "";
}

function isRetryableError(error) {
  const message = String(error?.message || "");
  const code = String(error?.code || "");

  return (
    RETRYABLE_ERROR_CODES.has(code) ||
    RETRYABLE_STATUS_CODES.some((status) => message.includes(`HTTP ${status}`))
  );
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withRetries(action, maxAttempts = 4) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt += 1;

    try {
      return await action();
    } catch (error) {
      if (attempt >= maxAttempts || !isRetryableError(error)) {
        throw error;
      }

      await wait(500 * 2 ** (attempt - 1));
    }
  }
}

function fetchUrlOnce(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "*/*",
        },
      },
      (response) => {
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          response.resume();
          const redirectedUrl = response.headers.location.startsWith("http")
            ? response.headers.location
            : new URL(response.headers.location, url).toString();
          fetchUrl(redirectedUrl).then(resolve, reject);
          return;
        }

        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`HTTP ${response.statusCode} for ${url}`));
          return;
        }

        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => resolve(body));
      }
    );

    request.setTimeout(15000, () => {
      request.destroy(Object.assign(new Error(`ETIMEDOUT for ${url}`), { code: "ETIMEDOUT" }));
    });
    request.on("error", reject);
  });
}

function fetchUrl(url) {
  return withRetries(() => fetchUrlOnce(url));
}

function downloadBinaryOnce(url, destination) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "*/*",
        },
      },
      (response) => {
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          response.resume();
          const redirectedUrl = response.headers.location.startsWith("http")
            ? response.headers.location
            : new URL(response.headers.location, url).toString();
          downloadBinary(redirectedUrl, destination).then(resolve, reject);
          return;
        }

        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`HTTP ${response.statusCode} for ${url}`));
          return;
        }

        const fileStream = fs.createWriteStream(destination);
        response.pipe(fileStream);
        fileStream.on("finish", () => fileStream.close(resolve));
        fileStream.on("error", reject);
      }
    );

    request.setTimeout(20000, () => {
      request.destroy(Object.assign(new Error(`ETIMEDOUT for ${url}`), { code: "ETIMEDOUT" }));
    });
    request.on("error", reject);
  });
}

function downloadBinary(url, destination) {
  return withRetries(() => downloadBinaryOnce(url, destination));
}

async function fetchProductUrls() {
  const urls = [];

  for (const sitemapUrl of PRODUCT_SITEMAPS) {
    const xml = await fetchUrl(sitemapUrl);
    const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    urls.push(...matches);
  }

  return urls;
}

function parseBreadcrumbs(html) {
  const breadcrumbBlock = matchFirst(
    html,
    /<script type="application\/ld\+json">\s*({[\s\S]*?"@type": "BreadcrumbList"[\s\S]*?})\s*<\/script>/
  );

  if (!breadcrumbBlock) {
    return [];
  }

  try {
    const parsed = JSON.parse(breadcrumbBlock);
    return (parsed.itemListElement || [])
      .map((item) => item?.item?.name)
      .filter(Boolean)
      .map((value) => String(value));
  } catch {
    return [];
  }
}

function parseBcDataJson(html) {
  const jsonText = matchFirst(html, /var BCData = ({[\s\S]*?});/);

  if (!jsonText) {
    return null;
  }

  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

function parseProductCustomFields(html) {
  const jsonText = matchFirst(html, /"productCustomFields":(\[[\s\S]*?\])\s*\}\)\.load\(\);/);

  if (!jsonText) {
    return [];
  }

  try {
    return JSON.parse(jsonText);
  } catch {
    return [];
  }
}

function normalizeBrandLabel(value = "") {
  return value
    .replace(/\b(Pellet|Wood|Coal|Gas|Electric|Outdoor|Fireplace|Stove)\s+Parts\b/gi, "")
    .replace(/\bParts\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function getFileExtension(url) {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname).toLowerCase();
  return ext || ".jpg";
}

async function localizeImage(imageUrl, sku) {
  if (!imageUrl) {
    return "";
  }

  ensureDir(PUBLIC_PARTS_DIR);
  const extension = getFileExtension(imageUrl);
  const fileName = `${toSlug(sku) || "part"}${extension}`;
  const destination = path.join(PUBLIC_PARTS_DIR, fileName);

  if (!fs.existsSync(destination)) {
    await downloadBinary(imageUrl, destination);
  }

  return `/products/parts/${fileName}`;
}

function parseProduct(html, productUrl) {
  const bcData = parseBcDataJson(html) ?? {};
  const customFields = parseProductCustomFields(html);
  const breadcrumbs = parseBreadcrumbs(html);

  const sku =
    bcData?.product_attributes?.sku ||
    stripHtml(matchFirst(html, /data-product-sku>([\s\S]*?)<\/span>/)) ||
    stripHtml(matchFirst(html, /"sku":"([^"]+)"/));

  const name = decodeHtml(stripHtml(matchFirst(html, /<h1 class="productView-title[^"]*">([\s\S]*?)<\/h1>/)));
  const brand =
    decodeHtml(matchFirst(html, /<a class="brand-item[^"]*"[^>]*aria-label="([^"]+)"/)) ||
    decodeHtml(stripHtml(matchFirst(html, /<span itemprop="name">([\s\S]*?)<\/span>/)));

  const metaDescription = decodeHtml(matchFirst(html, /<meta name="description" content="([^"]*)"/));
  const availability = decodeHtml(stripHtml(matchFirst(html, /<span class="productView-info-name">Availability:<\/span>\s*<span class="productView-info-value">([\s\S]*?)<\/span>/)));
  const ogImage = decodeHtml(matchFirst(html, /<meta property="og:image" content="([^"]+)"/));
  const stock = bcData?.product_attributes?.stock ?? null;
  const inStock = Boolean(bcData?.product_attributes?.instock);
  const price = Number(bcData?.product_attributes?.price?.without_tax?.value ?? 0);
  const compareAt = Number(bcData?.product_attributes?.price?.rrp_without_tax?.value ?? 0);
  const callForPriceMessage = bcData?.product_attributes?.call_for_price_message ?? null;
  const productId = matchFirst(html, /<input type="hidden" name="product_id" value="(\d+)"/);
  const partTypeField = customFields.find((field) => field?.name === "Part Type");
  const partType =
    partTypeField?.value ||
    decodeHtml(stripHtml(matchFirst(html, /<span class="productView-info-name Part Type">Part Type:<\/span>\s*<span class="productView-info-value Part Type">([\s\S]*?)<\/span>/)));

  const department = breadcrumbs[1] ?? "";
  const breadcrumbBrand = breadcrumbs[2] ?? "";
  const normalizedBreadcrumbBrand = normalizeBrandLabel(breadcrumbBrand);
  const shortDescription = metaDescription || name;

  return {
    productId,
    sku,
    slug: toSlug(sku || name),
    name,
    brand: normalizedBreadcrumbBrand || brand || breadcrumbBrand,
    department,
    breadcrumbBrand,
    breadcrumbs,
    price,
    salePrice: compareAt > price ? price : undefined,
    priceDisplay:
      callForPriceMessage || bcData?.product_attributes?.price?.without_tax?.formatted || "",
    compareAtPrice: compareAt > price ? compareAt : undefined,
    availability,
    inStock,
    stock,
    partType: partType || "",
    description: shortDescription,
    imageUrl: ogImage,
    productUrl,
  };
}

async function runPool(items, concurrency, iterator) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const currentIndex = cursor;
      cursor += 1;
      results[currentIndex] = await iterator(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.max(1, concurrency) }, () => worker())
  );

  return results;
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {
      source: "https://www.stove-parts-unlimited.com/",
      sitemap: "https://www.stove-parts-unlimited.com/xmlsitemap.php",
      totalProductUrls: 0,
      importedCount: 0,
      lastImportedIndex: -1,
      batches: [],
      updatedAt: null,
    };
  }

  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureDir(DATA_DIR);
  ensureDir(PARTS_DIR);
  ensureDir(PUBLIC_PARTS_DIR);

  const productUrls = await fetchProductUrls();
  const start = Math.max(0, args.start);
  const end = Math.min(productUrls.length, start + Math.max(1, args.limit));
  const selectedUrls = productUrls.slice(start, end);
  const batchName =
    args.batchName || `stove-parts-unlimited-${String(start + 1).padStart(5, "0")}-${String(end).padStart(5, "0")}`;

  const imported = await runPool(selectedUrls, args.concurrency, async (productUrl) => {
    try {
      const html = await fetchUrl(productUrl);
      const parsed = parseProduct(html, productUrl);

      if (args.downloadImages && parsed.imageUrl && parsed.sku) {
        parsed.imageUrl = await localizeImage(parsed.imageUrl, parsed.sku);
      }

      console.log(`ok ${parsed.sku || parsed.slug} ${productUrl}`);
      return parsed;
    } catch (error) {
      console.error(`fail ${productUrl} ${error.message}`);
      return {
        slug: toSlug(productUrl),
        productUrl,
        error: error.message,
      };
    }
  });

  const records = imported.filter((item) => item && !item.error);
  const filePath = path.join(PARTS_DIR, `${batchName}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(records, null, 2)}\n`);

  const manifest = loadManifest();
  const nextBatches = [
    ...manifest.batches.filter((batch) => batch.file !== path.relative(DATA_DIR, filePath)),
    {
      name: batchName,
      file: path.relative(DATA_DIR, filePath),
      start,
      end: end - 1,
      count: records.length,
      createdAt: new Date().toISOString(),
      downloadImages: args.downloadImages,
    },
  ].sort((a, b) => a.start - b.start);
  manifest.totalProductUrls = productUrls.length;
  manifest.importedCount = nextBatches.reduce((sum, batch) => sum + batch.count, 0);
  manifest.lastImportedIndex = end - 1;
  manifest.updatedAt = new Date().toISOString();
  manifest.batches = nextBatches;

  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`saved ${records.length} products to ${path.relative(ROOT, filePath)}`);
  console.log(`manifest updated at ${path.relative(ROOT, MANIFEST_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
