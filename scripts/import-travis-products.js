#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

const root = process.cwd();

function slugify(s) { return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function titleFromUrl(url, brand) {
  const slug = url.split('/product/')[1].replace(/\/$/, '');
  return slug.split('-').map(w => /^(gsb|mv|dvl|agp|tv|ho)$/.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase()+w.slice(1)).join(' ').replace(/Nexgen/g,'NexGen').replace(/Fyre/g,'Fyre™').replace(/Hybrid/g,'Hybrid™').replace(/Rect$/,'Rectangular').replace(/Arch$/,'Arched');
}
function csvEscape(v){const s=String(v??''); return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
async function fetchText(url){const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 AaronFireplaceCo/1.0'}}); if(!r.ok) throw new Error(`${url} ${r.status}`); return await r.text();}
function cdataLocs(xml, domain){return [...xml.matchAll(new RegExp(`<!\\[CDATA\\[(https://www\\.${domain}/[^\\]]+)\\]\\]>`,'g'))].map(m=>m[1]);}
function categoryFor(url, title, brand) {
  const text=(url+' '+title).toLowerCase();
  if (text.includes('pellet-insert')) return 'pellet-inserts-scraped.json';
  if (text.includes('pellet')) return 'pellet-stoves-scraped.json';
  if (text.includes('insert')) return text.includes('wood') ? 'wood-inserts-scraped.json' : 'gas-inserts-scraped.json';
  if (brand === 'Lopi') return text.includes('wood') || text.includes('answer') || text.includes('evergreen') || text.includes('endeavor') || text.includes('liberty') || text.includes('rockport') ? 'wood-stoves-scraped.json' : 'gas-stoves-scraped.json';
  if (text.includes('wood') || text.includes('elite') || text.includes('apex')) return 'wood-fireplaces-scraped.json';
  return 'gas-fireplaces-scraped.json';
}
function bestImage(html, base) {
  const urls=[...html.matchAll(/https?:\/\/www\.(?:fireplacex|lopistoves)\.com\/wp-content\/uploads\/[^"'<> ]+\.(?:jpg|jpeg|png|webp)/gi)].map(m=>m[0]);
  const bad=/logo|icon|banner|houzz|youtube|woodstove|firebuilder|dim|install|manual|pdf|brochure|sprite|retina|footer|saving/i;
  const good=urls.filter(u=>!bad.test(u));
  const full=good.filter(u=>!/-\d+x\d+\./.test(u));
  return (full[0] || good[0] || urls.find(u=>!bad.test(u)) || urls[0] || null);
}
async function download(url, dest) {
  const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 AaronFireplaceCo/1.0'}}); if(!r.ok) throw new Error(`image ${r.status}`);
  const buf=Buffer.from(await r.arrayBuffer());
  const out=await sharp(buf,{animated:false}).resize({width:1200,height:1200,fit:'inside',withoutEnlargement:true}).webp({quality:88}).toBuffer();
  fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.writeFileSync(dest,out);
  return crypto.createHash('sha1').update(out).digest('hex');
}
async function collect(domain, brand) {
  const xml=await fetchText(`https://www.${domain}/sitemap.xml`);
  const urls=cdataLocs(xml, domain).filter(u=>u.includes('/product/'));
  const out=[];
  for (const url of urls) {
    const rawTitle=titleFromUrl(url, brand);
    if (/accessor|remote|wall|coolsmart|firebuilder/i.test(rawTitle)) continue;
    const title = `${brand} ${rawTitle}`;
    const html=await fetchText(url);
    const img=bestImage(html,url);
    if(!img) continue;
    const categoryFile=categoryFor(url,title,brand);
    const sku=(brand==='Lopi'?'LOPI':'FPX')+'-'+slugify(rawTitle).toUpperCase().replace(/-/g,'');
    const cat=categoryFile.replace('-scraped.json','');
    const local=`/products-upgraded/${cat}/${slugify(sku)}.webp`;
    await download(img,path.join(root,'public',local));
    out.push({sku, name:title, slug:slugify(sku), price:0, salePrice:undefined, brand, imageUrl:local, productUrl:url, rating:0, reviewCount:0, isBestSeller:false, imageUrls:[local], contactForPricing:true, shortDescription:`Contact Aaron's Fireplace Co. for current ${brand} availability, configuration options, and dealer pricing.`, description:`${title}. Contact Aaron's Fireplace Co. for current availability, installation planning, configuration options, and dealer pricing.` , categoryFile, sourceImageUrl:img});
  }
  return out;
}
async function main(){
  const products=[...(await collect('fireplacex.com','FireplaceX')), ...(await collect('lopistoves.com','Lopi'))];
  const logs=[];
  for (const p of products) {
    const file=path.join(root,'data',p.categoryFile);
    const data=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):[];
    const {categoryFile, sourceImageUrl, ...prod}=p;
    const existing=data.findIndex(x=>x.sku===prod.sku || x.slug===prod.slug);
    if(existing>=0) data[existing]=prod; else data.push(prod);
    fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
    logs.push({...prod, categoryFile, sourceImageUrl});
  }
  fs.mkdirSync(path.join(root,'image-upgrade'),{recursive:true});
  const headers=['sku','brand','name','categoryFile','productUrl','sourceImageUrl','imageUrl'];
  fs.writeFileSync(path.join(root,'image-upgrade','travis-products-imported.csv'), headers.join(',')+'\n'+logs.map(r=>headers.map(h=>csvEscape(r[h])).join(',')).join('\n')+'\n');
  console.log(`imported ${products.length}`);
  const counts={}; for(const p of products) counts[p.categoryFile]=(counts[p.categoryFile]||0)+1; console.log(counts);
}
main().catch(e=>{console.error(e);process.exit(1)});
