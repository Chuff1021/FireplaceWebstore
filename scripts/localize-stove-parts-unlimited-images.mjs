#!/usr/bin/env node

import fs from "fs";
import path from "path";
import https from "https";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const PARTS_DIR = path.join(DATA_DIR, "parts");
const PUBLIC_PARTS_DIR = path.join(ROOT, "public", "products", "parts");
const MANIFEST_PATH = path.join(DATA_DIR, "stove-parts-unlimited-import-manifest.json");
const RETRYABLE_ERROR_CODES = new Set(["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN"]);
const RETRYABLE_STATUS_CODES = [408, 425, 429, 500, 502, 503, 504];

function parseArgs(argv) {
  const args = {
    concurrency: 8,
    onlyMissing: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    const next = argv[index + 1];

    if (value === "--concurrency" && next) {
      args.concurrency = Number.parseInt(next, 10) || args.concurrency;
      index += 1;
    } else if (value === "--only-missing") {
      args.onlyMissing = true;
    }
  }

  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function toSlug(input = "") {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function matchFirst(text, pattern) {
  const match = text.match(pattern);
  return match ? match[1] : "";
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

function getFileExtension(url) {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname).toLowerCase();
  return ext || ".jpg";
}

async function localizeImage(imageUrl, sku, slug) {
  if (!imageUrl) {
    return "";
  }

  ensureDir(PUBLIC_PARTS_DIR);
  const extension = getFileExtension(imageUrl);
  const fileName = `${toSlug(sku || slug) || "part"}${extension}`;
  const destination = path.join(PUBLIC_PARTS_DIR, fileName);

  if (!fs.existsSync(destination)) {
    await downloadBinary(imageUrl, destination);
  }

  return `/products/parts/${fileName}`;
}

function parseOgImage(html) {
  return decodeHtml(matchFirst(html, /<meta property="og:image" content="([^"]+)"/));
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

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => worker()));
  return results;
}

function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

async function processBatch(batch, args) {
  const batchPath = path.join(DATA_DIR, batch.file);
  const records = JSON.parse(fs.readFileSync(batchPath, "utf8"));
  let updated = false;
  let downloaded = 0;
  let fetched = 0;
  let stillMissing = 0;

  await runPool(records, args.concurrency, async (record) => {
    const currentUrl = String(record.imageUrl || "");

    if (currentUrl.startsWith("/products/parts/")) {
      return;
    }

    if (args.onlyMissing && currentUrl) {
      return;
    }

    let remoteUrl = currentUrl;

    if (!remoteUrl && record.productUrl) {
      try {
        const html = await fetchUrl(record.productUrl);
        fetched += 1;
        remoteUrl = parseOgImage(html);
      } catch (error) {
        console.error(`refetch-fail ${record.sku || record.slug} ${record.productUrl} ${error.message}`);
      }
    }

    if (!remoteUrl) {
      stillMissing += 1;
      return;
    }

    try {
      const localizedUrl = await localizeImage(remoteUrl, record.sku, record.slug);
      if (localizedUrl !== currentUrl) {
        record.imageUrl = localizedUrl;
        updated = true;
        downloaded += 1;
      }
      console.log(`localized ${record.sku || record.slug} ${localizedUrl}`);
    } catch (error) {
      console.error(`image-fail ${record.sku || record.slug} ${remoteUrl} ${error.message}`);
      if (!currentUrl) {
        stillMissing += 1;
      }
    }
  });

  if (updated) {
    fs.writeFileSync(batchPath, `${JSON.stringify(records, null, 2)}\n`);
  }

  return { batchPath, updated, downloaded, fetched, stillMissing };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureDir(PUBLIC_PARTS_DIR);
  const manifest = loadManifest();
  const batches = manifest.batches.filter((batch) => batch.file.startsWith("parts/"));
  let totalDownloaded = 0;
  let totalFetched = 0;
  let totalStillMissing = 0;

  for (const batch of batches) {
    const result = await processBatch(batch, args);
    totalDownloaded += result.downloaded;
    totalFetched += result.fetched;
    totalStillMissing += result.stillMissing;
    batch.downloadImages = true;
    console.log(
      `batch ${path.basename(result.batchPath)} downloaded=${result.downloaded} refetched=${result.fetched} stillMissing=${result.stillMissing}`
    );
  }

  manifest.lastImportedIndex = Math.max(...manifest.batches.map((batch) => batch.end));
  manifest.updatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`image localization complete downloaded=${totalDownloaded} refetched=${totalFetched} stillMissing=${totalStillMissing}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
