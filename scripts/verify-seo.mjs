import assert from 'node:assert/strict';
const origin=process.argv[2] || 'http://127.0.0.1:3110';
const sample=['/','/parts','/parts/harman','/parts/harman?p=unused','/parts/harman?page=2','/parts/napoleon/nps40-1','/parts/harman/p61a','/parts/buck/21','/category/parts','/category/parts?page=2','/category/gas-fireplaces','/category/wood-fireplaces','/category/wood-stoves','/category/wood-inserts','/category/pellet-stoves','/category/pellet-inserts','/category/electric-fireplaces','/product/ma-212400','/guides/find-fireplace-model-number','/guides','/tools/insert-planner','/tools/repair-or-replace','/installation'];
const titles=new Map();
for(const path of sample){
 const res=await fetch(origin+path);assert.equal(res.status,200,path);
 const html=await res.text();assert.match(html,/<h1[\s>]/,path);assert.match(html,/<link rel="canonical"/);assert(!html.includes('John D.'),path);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert(title,path);titles.set(path,title);
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
 if(path.startsWith('/category/parts')){assert.match(html,/<a[^>]+href="\/product\//);assert.match(html,/href="\/category\/parts\?page=/);}
 if(path==='/product/ma-212400'){assert.match(html,/<h1[^>]*>Buck 21 Complete Door Assembly/);assert.match(html,/4 weeks until ready to ship/i);assert(!html.includes('https://schema.org/InStock'));}
 if(path==='/category/parts?page=2')assert.match(html,/rel="canonical" href="https:\/\/aaronsfireplaceco.com\/category\/parts\?page=2"/);
 if(path==='/parts/harman/p61a'){assert(html.includes('008085092'));}
 console.log('PASS',path,title);
}
assert.notEqual(titles.get('/category/gas-fireplaces'),titles.get('/category/wood-stoves'));
for(const path of ['/product/seo-missing-20261030','/category/invalid-category','/parts/not-a-brand','/parts/harman/not-a-model','/category/parts?page=999999'])assert.equal((await fetch(origin+path)).status,404,path);
const filtered=await (await fetch(origin+'/category/parts?q=MA-212400')).text();assert.match(filtered,/name="robots" content="noindex, follow"/);
const legacy=await fetch(origin+'/category/parts?brand=Harman',{redirect:'manual'});assert([307,308].includes(legacy.status));assert.equal(legacy.headers.get('location'),'/parts/harman');
const api=await (await fetch(origin+'/api/products?slug=ma-212400&limit=1')).json();assert.equal(api.length,1);assert.equal(api[0].partsAvailability,'out_of_stock');
const search=await(await fetch(origin+'/api/products?q=MA-212400&limit=100')).json();assert(search.some(p=>p.sku==='MA-212400'));
const sitemap=await(await fetch(origin+'/sitemap.xml')).text();const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);assert(urls.length>30000);assert.equal(new Set(urls).size,urls.length);assert(urls.includes('https://aaronsfireplaceco.com/parts/buck/21'));assert(!urls.some(u=>/\/(?:cart|checkout|admin|search)(?:[/?]|$)/.test(u)));assert(!urls.some(u=>u.includes('?')));
const robots=await(await fetch(origin+'/robots.txt')).text();assert(robots.includes('Sitemap: https://aaronsfireplaceco.com/sitemap.xml'));assert(!robots.includes('Disallow: /\n'));
console.log('PASS 404s, filtered noindex, legacy brand redirect, exact-SKU search, stock override, valid sitemap:',urls.length,'unique URLs, robots discovery');
