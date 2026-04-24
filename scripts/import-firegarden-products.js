#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = process.cwd();
const pages = [
  ['FG-4024-LINEAR-FIREPLACE', 'Fire Garden 4024 Linear Outdoor Gas Fireplace', 'https://www.firegardenoutdoors.com/4024-linear-fireplace/', 'outdoor-fireplaces-scraped.json'],
  ['FG-6424-LINEAR-FIREPLACE', 'Fire Garden 6424 Linear Outdoor Gas Fireplace', 'https://www.firegardenoutdoors.com/6424-linear-fireplaces/', 'outdoor-fireplaces-scraped.json'],
  ['FG-4035-TRADITIONAL-FIREPLACE', 'Fire Garden 4035 Outdoor Traditional Gas Fireplace', 'https://www.firegardenoutdoors.com/4035-outdoor-traditional-gas-fireplaces/', 'outdoor-fireplaces-scraped.json'],
  ['FG-VORACIOUS-BURNERS', 'Fire Garden Voracious Fire Pit Burners', 'https://www.firegardenoutdoors.com/voracious-fire-pit-burners/', 'outdoor-fireplaces-scraped.json'],
  ['FG-TEMPEST-TORCH', 'Fire Garden Tempest Outdoor Torch', 'https://www.firegardenoutdoors.com/product/tempest-20k-torches-24v-electric-ignition-ng-torch/', 'outdoor-fireplaces-scraped.json'],
  ['FG-36-FIREPIT-BURNER', 'Fire Garden 36 Inch Fire Pit Burner', 'https://www.firegardenoutdoors.com/product/36-firepit-burner/', 'outdoor-fireplaces-scraped.json'],
];
function slugify(s){return s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function csvEscape(v){const s=String(v??'');return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
async function fetchText(url){const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 AaronFireplaceCo/1.0'}}); if(!r.ok) throw new Error(`${url} ${r.status}`); return r.text()}
function bestImage(html){
  const urls=[...html.matchAll(/https?:\/\/www\.firegardenoutdoors\.com\/wp-content\/uploads\/[^"'<> ]+\.(?:jpg|jpeg|png|webp)/gi)].map(m=>m[0]);
  const bad=/logo|icon|dealer|brochure|manual|pdf|sprite|retina|footer|saving|facebook|instagram/i;
  const good=urls.filter(u=>!bad.test(u));
  const hero=good.find(u=>/16x8|1600x800|Install|Lifestyle|Graphite|Fireplace|Firepit/i.test(u));
  return hero || good.find(u=>!/-\d+x\d+\./.test(u)) || good[0] || urls[0];
}
async function download(url,dest){
 const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 AaronFireplaceCo/1.0'}}); if(!r.ok) throw new Error(`image ${r.status}`);
 const input=Buffer.from(await r.arrayBuffer());
 const out=await sharp(input,{animated:false}).resize({width:1400,height:1000,fit:'inside',withoutEnlargement:true}).webp({quality:88}).toBuffer();
 fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.writeFileSync(dest,out);
}
async function main(){
 const imported=[];
 for(const [sku,name,url,file] of pages){
  const html=await fetchText(url);
  const img=bestImage(html);
  if(!img) throw new Error(`no image ${url}`);
  const local=`/products-upgraded/outdoor-fireplaces/${slugify(sku)}.webp`;
  await download(img,path.join(root,'public',local));
  const jsonPath=path.join(root,'data',file);
  const data=JSON.parse(fs.readFileSync(jsonPath,'utf8'));
  const product={sku,name,slug:slugify(sku),price:0,brand:'Fire Garden',imageUrl:local,imageUrls:[local],productUrl:url,rating:0,reviewCount:0,isBestSeller:false,contactForPricing:true,shortDescription:"Contact Aaron's Fireplace Co. for current Fire Garden outdoor fireplace availability, configuration options, and dealer pricing.",description:`${name}. Fire Garden by Travis Industries outdoor fire feature. Contact Aaron's Fireplace Co. for current availability, installation planning, configuration options, and dealer pricing.`};
  const i=data.findIndex(x=>x.sku===sku || x.slug===product.slug); if(i>=0)data[i]=product; else data.push(product);
  fs.writeFileSync(jsonPath,JSON.stringify(data,null,2)+'\n');
  imported.push({...product,categoryFile:file,sourceImageUrl:img});
 }
 const headers=['sku','brand','name','categoryFile','productUrl','sourceImageUrl','imageUrl'];
 fs.writeFileSync(path.join(root,'image-upgrade','firegarden-products-imported.csv'),headers.join(',')+'\n'+imported.map(r=>headers.map(h=>csvEscape(r[h])).join(',')).join('\n')+'\n');
 console.log(`imported ${imported.length}`);
}
main().catch(e=>{console.error(e);process.exit(1)});
