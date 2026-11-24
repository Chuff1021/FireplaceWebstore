import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { jsonLd, pageMetadata, productSchema, isSearchEligibleProduct } from '../src/lib/seo.ts';
import { classifyLanding } from '../src/lib/traffic-attribution.ts';

test('owner-removed appliance brands stay excluded from the appliance catalog sources', () => {
  for (const fileName of ['wood-stoves-scraped.json', 'gas-stoves-scraped.json', 'wood-inserts-scraped.json', 'pellet-stoves-scraped.json', 'pellet-inserts-scraped.json']) {
    const products = JSON.parse(readFileSync(new URL(`../data/${fileName}`, import.meta.url), 'utf8'));
    assert.equal(products.some((product) => product.brand?.toLowerCase() === 'ds stoves'), false);
    assert.equal(products.some((product) => product.name?.toLowerCase().startsWith('england stove works ')), false);
    assert.equal(products.some((product) => product.name?.toLowerCase().startsWith('comfortbilt pellet stoves ')), false);
  }
});

test('pellet appliance categories contain only Lopi and the current Quadra-Fire lineup', () => {
  const stoves = JSON.parse(readFileSync(new URL('../data/pellet-stoves-scraped.json', import.meta.url), 'utf8'));
  const inserts = JSON.parse(readFileSync(new URL('../data/pellet-inserts-scraped.json', import.meta.url), 'utf8'));
  const allowedBrands = new Set(['Lopi', 'Quadra-Fire']);

  assert.equal(stoves.length, 6);
  assert.equal(inserts.length, 4);
  assert.equal(stoves.filter((product) => product.brand === 'Quadra-Fire').length, 5);
  assert.equal(inserts.filter((product) => product.brand === 'Quadra-Fire').length, 3);
  assert.equal(stoves.every((product) => allowedBrands.has(product.brand)), true);
  assert.equal(inserts.every((product) => allowedBrands.has(product.brand)), true);
});

test('wood stove and insert listings contain only the six approved brands', () => {
  const approvedBrands = ['Buck Stove', 'Empire Stove', 'IronStrike', 'Lopi', 'Quadra-Fire', 'Vermont Castings'];
  const readCategory = (slug) => JSON.parse(readFileSync(new URL(`../data/${slug}-scraped.json`, import.meta.url), 'utf8'));
  const stoves = readCategory('wood-stoves');
  const inserts = readCategory('wood-inserts');
  const gasInserts = readCategory('gas-inserts');

  for (const category of [stoves, inserts]) {
    assert.deepEqual([...new Set(category.map((product) => product.brand))].sort(), approvedBrands);
    assert.equal(new Set(category.map((product) => product.slug)).size, category.length);
  }
  const lopiWoodSlugs = new Set(inserts.filter((product) => product.brand === 'Lopi').map((product) => product.slug));
  for (const slug of ['lopi-evergreennexgenhybridinsert', 'lopi-answernexgenhybridinsert', 'lopi-answernexgenfyreinsert']) {
    assert.ok(lopiWoodSlugs.has(slug), slug);
  }
  assert.ok(gasInserts.every((product) => !lopiWoodSlugs.has(product.slug)));
});

test('product schema does not invent stock, reviews, offers or manufacturer identifiers', () => {
  const product = { slug: 'part', name: 'Part', sku: 'ABC', brand: 'Brand', description: 'A part', images: ['/part.jpg'], price: 50, categoryId: 'parts', partsAvailability: 'unverified', canPurchase: false };
  const data = productSchema(product);
  assert.equal(data.offers, undefined); assert.equal(data.aggregateRating, undefined); assert.equal(data.gtin, undefined);
  assert.equal(productSchema({ ...product, partsAvailability: 'available', canPurchase: true }).offers.price, '50.00');
  assert.equal(productSchema({ ...product, partsAvailability: 'out_of_stock', canPurchase: true }).offers, undefined);
  const unsafe = '</script><script>alert(1)</script>';
  assert(!jsonLd({ text: unsafe }).includes('<'));
  assert.equal(JSON.parse(jsonLd({ text: unsafe })).text, unsafe);
});
test('canonical pages and deliberate noindex filters do not inherit a homepage canonical', () => {
  const metadata = pageMetadata('Parts — Page 2', 'Description', '/category/parts?page=2');
  assert.equal(metadata.alternates.canonical, 'https://aaronsfireplaceco.com/category/parts?page=2');
  assert.equal(metadata.robots.index, true);
  assert.equal(pageMetadata('Search', 'Description', '/category/parts', true).robots.index, false);
  assert.equal(isSearchEligibleProduct({ categoryId: 'parts', specifications: { Department: 'Pool & Spa Parts' } }), false);
  assert.equal(isSearchEligibleProduct({ categoryId: 'parts', specifications: { Department: 'Gas Fireplace Parts' } }), true);
});
test('source attribution stores only a coarse channel and safe public landing path', () => {
  assert.deepEqual(classifyLanding('https://aaronsfireplaceco.com/product/part?email=private@example.com', 'https://www.google.com/search?q=private'), { channel: 'organic', landingPath: '/product/part' });
  assert.equal(classifyLanding('https://aaronsfireplaceco.com/?gclid=secret', '').channel, 'paid');
  assert.deepEqual(classifyLanding('https://aaronsfireplaceco.com/checkout?secret=1', ''), { channel: 'direct', landingPath: '/' });
  assert.equal(classifyLanding('https://aaronsfireplaceco.com/guides?utm_medium=email', '').channel, 'email');
  assert.equal(classifyLanding('https://aaronsfireplaceco.com/parts', 'https://www.bing.com/search?q=parts').channel, 'organic');
  assert.equal(classifyLanding('https://aaronsfireplaceco.com/parts', 'https://example.com/link').channel, 'referral');
});
