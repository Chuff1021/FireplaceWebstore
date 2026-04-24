#!/usr/bin/env node
/*
  Download authorized/dealer-permitted fireplace product images, save locally,
  and update non-parts scraped fireplace JSON datasets to use local URLs.
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const root = process.cwd();
const candidatesDir = path.join(root, 'image-upgrade');
const outputRoot = path.join(root, 'public', 'products-upgraded');
const logPath = path.join(candidatesDir, 'applied-image-upgrades.csv');
const failurePath = path.join(candidatesDir, 'failed-image-upgrades.csv');

const candidateFiles = [
  'candidates-electric-brands.csv',
  'candidates-napoleon-majestic.csv',
  'candidates-superior-empire.csv',
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (quoted) {
      if (c === '"' && n === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else {
      if (c === '"') quoted = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c !== '\r') field += c;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [headers, ...body] = rows.filter(r => r.some(v => v !== ''));
  return body.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] || ''])));
}

function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function categorySlug(categoryFile) {
  return path.basename(categoryFile).replace('-scraped.json', '').replace('.json', '');
}

function safeSku(sku) {
  return sku.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function fetchWithTimeout(url, ms = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 AaronFireplaceCoImageUpgrade/1.0',
        'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function extractDirectImageFromPage(url) {
  const res = await fetchWithTimeout(url, 20000);
  if (!res.ok) throw new Error(`page ${res.status}`);
  const html = await res.text();

  // eFireplaceStore pages often expose much better product WebP files in the
  // page body than the tiny og:image/Icon_Image GIF. Prefer those.
  const all = Array.from(html.matchAll(/(?:https?:\/\/www\.efireplacestore\.com)?\/images\/[^"'<> ]+/gi))
    .map(m => new URL(m[0], url).toString().replace(/&amp;/g, '&'))
    .filter(u => !/Homepage\/|efslogo|method=button/i.test(u));
  const webps = all.filter(u => /_\d+\.webp(?:$|[?#])/i.test(u));
  if (webps.length) {
    // Higher numeric suffix usually corresponds to the generated large image.
    webps.sort((a, b) => {
      const na = Number((a.match(/_(\d+)\.webp/i) || [0, 0])[1]);
      const nb = Number((b.match(/_(\d+)\.webp/i) || [0, 0])[1]);
      return nb - na;
    });
    return webps[0];
  }

  const main = all.find(u => /\/Main_Image\//i.test(u));
  if (main) return main;

  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return new URL(m[1], url).toString();
  }
  throw new Error('no direct image found');
}

async function downloadAndConvert(imageUrl, destPath) {
  const res = await fetchWithTimeout(imageUrl, 25000);
  if (!res.ok) throw new Error(`image ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  if (input.length < 1000) throw new Error(`image too small ${input.length}`);
  const converted = await sharp(input, { animated: false })
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88 })
    .toBuffer();
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, converted);
  return { bytes: converted.length, sha1: crypto.createHash('sha1').update(converted).digest('hex') };
}

async function main() {
  const bySku = new Map();
  for (const file of candidateFiles) {
    const p = path.join(candidatesDir, file);
    if (!fs.existsSync(p)) continue;
    for (const row of parseCsv(fs.readFileSync(p, 'utf8'))) {
      if ((row.confidence || '').toLowerCase().startsWith('high') && row.sku && row.category_file) {
        if (!bySku.has(row.sku)) bySku.set(row.sku, row);
      }
    }
  }

  const applied = [];
  const failed = [];
  const jsonUpdates = new Map();
  const rows = [...bySku.values()];
  let index = 0;

  async function worker() {
    while (index < rows.length) {
      const row = rows[index++];
      const cat = categorySlug(row.category_file);
      const sku = row.sku;
      try {
        let direct = row.image_url_if_direct;
        if (/efireplacestore\.com/i.test(row.manufacturer_or_authorized_source_url || '')) {
          direct = await extractDirectImageFromPage(row.manufacturer_or_authorized_source_url);
        } else if (!direct) {
          direct = await extractDirectImageFromPage(row.manufacturer_or_authorized_source_url);
        }
        const filename = `${safeSku(sku)}.webp`;
        const relUrl = `/products-upgraded/${cat}/${filename}`;
        const destPath = path.join(outputRoot, cat, filename);
        const result = await downloadAndConvert(direct, destPath);
        applied.push({
          sku,
          brand: row.brand,
          category_file: row.category_file,
          product_name: row.product_name,
          source_page: row.manufacturer_or_authorized_source_url,
          source_image_url: direct,
          local_url: relUrl,
          bytes: result.bytes,
          sha1: result.sha1,
        });
        if (!jsonUpdates.has(row.category_file)) jsonUpdates.set(row.category_file, new Map());
        jsonUpdates.get(row.category_file).set(sku, relUrl);
        if (applied.length % 50 === 0) console.log(`applied ${applied.length}/${rows.length}`);
      } catch (err) {
        failed.push({ sku, brand: row.brand, category_file: row.category_file, source_page: row.manufacturer_or_authorized_source_url, image_url: row.image_url_if_direct, error: err.message });
      }
    }
  }

  await Promise.all(Array.from({ length: 8 }, worker));

  for (const [categoryFile, updates] of jsonUpdates) {
    const jsonPath = path.join(root, 'data', path.basename(categoryFile));
    if (!fs.existsSync(jsonPath)) continue;
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    let changed = 0;
    for (const item of data) {
      const local = updates.get(item.sku);
      if (local) {
        item.imageUrl = local;
        item.imageUrls = [local];
        changed++;
      }
    }
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
    console.log(`updated ${changed} in ${jsonPath}`);
  }

  const headers = ['sku','brand','category_file','product_name','source_page','source_image_url','local_url','bytes','sha1'];
  fs.writeFileSync(logPath, headers.join(',') + '\n' + applied.map(r => headers.map(h => csvEscape(r[h])).join(',')).join('\n') + '\n');
  const fheaders = ['sku','brand','category_file','source_page','image_url','error'];
  fs.writeFileSync(failurePath, fheaders.join(',') + '\n' + failed.map(r => fheaders.map(h => csvEscape(r[h])).join(',')).join('\n') + '\n');
  console.log(`DONE applied=${applied.length} failed=${failed.length}`);
}

main().catch(err => { console.error(err); process.exit(1); });
