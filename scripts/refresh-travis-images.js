#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const root = process.cwd();
const files = ['gas-fireplaces-scraped.json','wood-fireplaces-scraped.json','gas-stoves-scraped.json','wood-stoves-scraped.json','gas-inserts-scraped.json','pellet-stoves-scraped.json','pellet-inserts-scraped.json'];
const bad = /logo|banner|dealer|brochure|manual|pdf|sprite|retina|footer|saving|facebook|instagram|Icon_Image/i;
function slugify(s){return s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
async function fetchText(url){const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 AaronFireplaceCo/1.0'}}); if(!r.ok) throw new Error(`${url} ${r.status}`); return r.text()}
function imageCandidates(html, base){
 const urls=[...html.matchAll(/https?:\/\/www\.(?:fireplacex|lopistoves)\.com\/wp-content\/uploads\/[^"'<> )]+\.(?:jpg|jpeg|png|webp)/gi)].map(m=>m[0].replace(/&amp;/g,'&'));
 const unique=[...new Set(urls)].filter(u=>!bad.test(u));
 const model=base.split('/product/')[1]?.replace(/\/$/,'') || '';
 const modelWords=model.split('-').filter(w=>w.length>1 && !['and','the','gas','wood'].includes(w));
 return unique.sort((a,b)=>{
   const score=(u)=>{
    const l=u.toLowerCase(); let s=0;
    if(!/-\d+x\d+\./.test(u)) s+=5;
    if(/install|lifestyle|room|beauty|hero/i.test(u)) s+=5;
    if(/_800|800x600|1200|1600|webp/i.test(u)) s+=3;
    for(const w of modelWords) if(l.includes(w)) s+=2;
    if(/logo|text|diagram|dimension|spec|chart|badge/i.test(u)) s-=10;
    return s;
   };
   return score(b)-score(a);
 });
}
async function download(url,dest){
 const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 AaronFireplaceCo/1.0'}}); if(!r.ok) throw new Error(`image ${r.status}`);
 const input=Buffer.from(await r.arrayBuffer());
 const out=await sharp(input,{animated:false}).resize({width:1400,height:1200,fit:'inside',withoutEnlargement:true}).webp({quality:88}).toBuffer();
 fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.writeFileSync(dest,out);
}
async function main(){
 const log=[];
 for(const file of files){
  const data=JSON.parse(fs.readFileSync(path.join(root,'data',file),'utf8'));
  for(const item of data){
   if(!['Lopi','Fireplace Xtrordinair'].includes(item.brand) || !item.productUrl) continue;
   try{
    const html=await fetchText(item.productUrl);
    const candidates=imageCandidates(html,item.productUrl).slice(0,4);
    if(!candidates.length) throw new Error('no candidates');
    const cat=file.replace('-scraped.json','');
    const urls=[];
    for(let i=0;i<candidates.length;i++){
      const local=`/products-upgraded/${cat}/${slugify(item.sku)}${i?`-${i+1}`:''}.webp`;
      await download(candidates[i],path.join(root,'public',local));
      urls.push(local);
    }
    item.imageUrl=urls[0]; item.imageUrls=urls;
    log.push({sku:item.sku, name:item.name, count:urls.length, source:candidates[0]});
   }catch(e){log.push({sku:item.sku, name:item.name, error:e.message});}
  }
  fs.writeFileSync(path.join(root,'data',file),JSON.stringify(data,null,2)+'\n');
 }
 fs.writeFileSync(path.join(root,'image-upgrade','travis-image-refresh.json'),JSON.stringify(log,null,2)+'\n');
 console.log('refreshed',log.filter(x=>!x.error).length,'failed',log.filter(x=>x.error).length);
}
main().catch(e=>{console.error(e);process.exit(1)});
