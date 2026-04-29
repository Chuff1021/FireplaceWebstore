const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const root = process.cwd();
const logoPath = path.join(root, 'public/logo.png');

async function logoBuffer(maxSize) {
  return sharp(logoPath)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
    .resize(maxSize, maxSize, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function makePng(size, out) {
  const inner = Math.round(size * 0.84);
  const logo = await logoBuffer(inner);
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(out);
}

function icoFromPngs(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const entries = [];
  let offset = 6 + count * 16;
  for (const image of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(image.size >= 256 ? 0 : image.size, 0);
    entry.writeUInt8(image.size >= 256 ? 0 : image.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += image.buffer.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((image) => image.buffer)]);
}

(async () => {
  await makePng(512, path.join(root, 'public/icon.png'));
  await makePng(512, path.join(root, 'src/app/icon.png'));
  await makePng(180, path.join(root, 'public/apple-touch-icon.png'));
  const images = [];
  for (const size of [16, 32, 48]) {
    images.push({
      size,
      buffer: await sharp(path.join(root, 'public/icon.png')).resize(size, size).png().toBuffer(),
    });
  }
  fs.writeFileSync(path.join(root, 'src/app/favicon.ico'), icoFromPngs(images));
})();
