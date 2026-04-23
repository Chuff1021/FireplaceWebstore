#!/usr/bin/env node

/**
 * Builds data/cross-vendor-sku-map.json: a per-SKU index of every vendor we
 * have catalog data for, so a shopper on a Stove Parts Unlimited (Mountain
 * View) listing can instantly see whether Energy Parts Plus also stocks it
 * and at what price.
 *
 * Only SKUs that appear in 2+ vendors are written — the file is meant to
 * answer "is this part available elsewhere?" quickly, not to duplicate the
 * full catalog.
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const PARTS_DIR = path.join(DATA_DIR, "parts");
const EPP_PATH = path.join(DATA_DIR, "energy-parts-plus-products.json");
const OUT_PATH = path.join(DATA_DIR, "cross-vendor-sku-map.json");

function normalizeSku(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function collectSpu() {
  const out = new Map();
  const files = fs
    .readdirSync(PARTS_DIR)
    .filter((name) => name.startsWith("stove-parts-unlimited-batch-") && name.endsWith(".json"))
    .sort();

  for (const file of files) {
    const full = path.join(PARTS_DIR, file);
    const batch = JSON.parse(fs.readFileSync(full, "utf8"));
    for (const product of batch) {
      const sku = normalizeSku(product.sku);
      if (!sku) continue;
      out.set(sku, {
        vendor: "stove-parts-unlimited",
        sku: product.sku,
        name: product.name,
        price: product.price ?? null,
        priceDisplay: product.priceDisplay ?? null,
        inStock: product.inStock ?? null,
        stock: product.stock ?? null,
        availability: product.availability ?? null,
        productUrl: product.productUrl ?? null,
        imageUrl: product.imageUrl ?? null,
      });
    }
  }
  return out;
}

function collectEpp() {
  if (!fs.existsSync(EPP_PATH)) return new Map();
  const out = new Map();
  const raw = JSON.parse(fs.readFileSync(EPP_PATH, "utf8"));
  for (const product of raw) {
    const sku = normalizeSku(product.sku);
    if (!sku) continue;
    out.set(sku, {
      vendor: "energy-parts-plus",
      sku: product.sku,
      name: product.name,
      price: product.price ?? null,
      salePrice: product.salePrice ?? null,
      stock: product.stock ?? null,
      availability: product.availability ?? null,
      productUrl: product.productUrl ?? null,
      imageUrl: product.imageUrl ?? null,
    });
  }
  return out;
}

function main() {
  const spu = collectSpu();
  const epp = collectEpp();

  const allSkus = new Set([...spu.keys(), ...epp.keys()]);
  const entries = [];

  for (const sku of allSkus) {
    const vendors = [];
    if (spu.has(sku)) vendors.push(spu.get(sku));
    if (epp.has(sku)) vendors.push(epp.get(sku));
    if (vendors.length < 2) continue;
    entries.push({ sku, vendors });
  }

  entries.sort((a, b) => a.sku.localeCompare(b.sku));

  const output = {
    generatedAt: new Date().toISOString(),
    totalSkus: entries.length,
    vendorsSeen: {
      "stove-parts-unlimited": spu.size,
      "energy-parts-plus": epp.size,
    },
    entries,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
  console.log(
    `Wrote ${OUT_PATH}: ${entries.length} cross-vendor SKU matches (SPU=${spu.size}, EPP=${epp.size})`
  );
}

main();
