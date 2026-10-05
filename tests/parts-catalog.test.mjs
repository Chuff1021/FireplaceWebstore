import assert from 'node:assert/strict';
import test from 'node:test';
import { filterPartsCatalog, normalizePartsBrand } from '../src/lib/parts-catalog.ts';

const part = (sku, brand, department, type, price = 10, name = sku) => ({
  id: sku, sku, slug: sku.toLowerCase(), name, brand, categoryId: 'parts',
  subcategoryId: department, price, description: `${brand} replacement ${type}`,
  specifications: { 'Part Type': type },
});
const products = [
  part('H-001', 'Harman', 'wood-coal-stove-parts', 'Gaskets & Adhesives'),
  part('H-002', 'Harman', 'pellet-stove-parts', 'Igniters', 50),
  part('H-003', 'Harman', 'pellet-stove-parts', 'Blowers & Fans', 100),
  part('N-001', 'Napoleon', 'gas-fireplace-parts', 'Pilot Assemblies', 200),
];
const request = params => filterPartsCatalog(products, new URLSearchParams(params));

test('manufacturer labels merge wood/coal and gas-log paths into the same manufacturer', () => {
  assert.equal(normalizePartsBrand('Harman Wood & Coal Parts'), 'Harman');
  assert.equal(normalizePartsBrand('Napoleon Gas Log Set Parts'), 'Napoleon');
  assert.equal(normalizePartsBrand('Newmac Wood & Oil Parts'), 'Newmac');
  assert.equal(normalizePartsBrand('Modern Flames Electric Fireplace Parts'), 'Modern Flames');
  assert.equal(normalizePartsBrand('Quadrafire'), 'Quadra-Fire');
  assert.equal(normalizePartsBrand('Pumps & Parts'), 'Pumps & Parts');
});

test('manufacturer, department, and part type narrow the catalog together', () => {
  const allHarman = request({ brand: 'harman' });
  assert.equal(allHarman.total, 3);
  assert(allHarman.products.every(p => p.brand === 'Harman'));
  const selected = request({ brand: 'Harman', category: 'pellet-stove-parts', partType: 'Igniters' });
  assert.deepEqual(selected.products.map(p => p.sku), ['H-002']);
  assert.deepEqual(selected.facets.brands, [{ name: 'Harman', count: 2 }]);
  assert(selected.facets.partTypes.some(p => p.name === 'Blowers & Fans'));
  assert.equal(request({ brand: 'Napoleon', category: 'pellet-stove-parts' }).total, 0);
});

test('part-number searches ignore SKU punctuation and rank exact numbers first', () => {
  const catalog = [...products, part('H-002-EXT', 'Harman', 'pellet-stove-parts', 'Igniters', 5, 'AAA extension')];
  const result = filterPartsCatalog(catalog, new URLSearchParams({ q: 'h002' }));
  assert.equal(result.total, 2);
  assert.equal(result.products[0].sku, 'H-002');
  assert.equal(request({ q: 'replacement pilot' }).products[0].sku, 'N-001');
});

test('pagination exposes parts after the first page and clamps invalid page sizes', () => {
  const first = request({ pageSize: '2', page: '1' });
  const second = request({ pageSize: '2', page: '2' });
  assert.equal(first.totalPages, 2);
  assert.equal(first.products.length, 2);
  assert.equal(second.products.length, 2);
  assert(!first.products.some(p => second.products.some(q => p.sku === q.sku)));
  assert.equal(request({ pageSize: '2', page: '999' }).page, 2);
  assert.equal(request({ pageSize: '999999' }).pageSize, 48);
  assert.equal(request({ pageSize: '-1', page: 'oops' }).pageSize, 20);
  assert.equal(request({ brand: 'Missing' }).products.length, 0);
});
