const fs = require('fs');
const zlib = require('zlib');

// CRC32 implementation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

const inputPath = 'C:/Users/Umar/.gemini/antigravity-ide/brain/17466493-d237-4928-b6c4-cfc5a55ef8b9/.user_uploaded/media_1790610116697.png';
const outputPath = 'c:/Users/Umar/Desktop/NexoreUI/apps/docs/public/images/products/toy-car.png';

const buf = fs.readFileSync(inputPath);

let p = 8;
const idatChunks = [];
while (p < buf.length) {
  const len = buf.readUInt32BE(p);
  const type = buf.subarray(p + 4, p + 8).toString('ascii');
  if (type === 'IDAT') {
    idatChunks.push(buf.subarray(p + 8, p + 8 + len));
  }
  p += 12 + len;
}

const decomp = zlib.inflateSync(Buffer.concat(idatChunks));
const width = 1024, height = 682;
const raw = Buffer.alloc(width * height * 4);

let srcOff = 0;
for (let y = 0; y < height; y++) {
  const filter = decomp[srcOff++];
  for (let x = 0; x < width; x++) {
    for (let c = 0; c < 4; c++) {
      let val = decomp[srcOff++];
      const left = x > 0 ? raw[(y * width + (x - 1)) * 4 + c] : 0;
      const up = y > 0 ? raw[((y - 1) * width + x) * 4 + c] : 0;
      const upLeft = (x > 0 && y > 0) ? raw[((y - 1) * width + (x - 1)) * 4 + c] : 0;
      if (filter === 1) val = (val + left) & 0xff;
      else if (filter === 2) val = (val + up) & 0xff;
      else if (filter === 3) val = (val + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) {
        const p_val = left + up - upLeft;
        const pa = Math.abs(p_val - left);
        const pb = Math.abs(p_val - up);
        const pc = Math.abs(p_val - upLeft);
        let pr = left;
        if (pb < pa && pb <= pc) pr = up;
        else if (pc < pa) pr = upLeft;
        val = (val + pr) & 0xff;
      }
      raw[(y * width + x) * 4 + c] = val;
    }
  }
}

// Flood fill from borders to identify outer background (black pixels)
const visited = new Uint8Array(width * height);
const queue = new Int32Array(width * height);
let qHead = 0, qTail = 0;

function isBackgroundPixel(idx) {
  const b = idx * 4;
  const r = raw[b], g = raw[b + 1], bl = raw[b + 2];
  // Pure black only
  return (r === 0 && g === 0 && bl === 0);
}

for (let x = 0; x < width; x++) {
  const topIdx = x;
  if (isBackgroundPixel(topIdx)) {
    visited[topIdx] = 1;
    queue[qTail++] = topIdx;
  }
  const btmIdx = (height - 1) * width + x;
  if (isBackgroundPixel(btmIdx)) {
    visited[btmIdx] = 1;
    queue[qTail++] = btmIdx;
  }
}

for (let y = 0; y < height; y++) {
  const lIdx = y * width;
  if (!visited[lIdx] && isBackgroundPixel(lIdx)) {
    visited[lIdx] = 1;
    queue[qTail++] = lIdx;
  }
  const rIdx = y * width + (width - 1);
  if (!visited[rIdx] && isBackgroundPixel(rIdx)) {
    visited[rIdx] = 1;
    queue[rIdx] = 1;
    queue[qTail++] = rIdx;
  }
}

while (qHead < qTail) {
  const curr = queue[qHead++];
  const cx = curr % width;
  const cy = Math.floor(curr / width);

  const neighbors = [
    cx > 0 ? curr - 1 : -1,
    cx < width - 1 ? curr + 1 : -1,
    cy > 0 ? curr - width : -1,
    cy < height - 1 ? curr + width : -1,
  ];

  for (let i = 0; i < 4; i++) {
    const n = neighbors[i];
    if (n >= 0 && !visited[n]) {
      if (isBackgroundPixel(n)) {
        visited[n] = 1;
        queue[qTail++] = n;
      }
    }
  }
}

// Set visited pixels to alpha = 0
for (let i = 0; i < width * height; i++) {
  if (visited[i]) {
    raw[i * 4 + 3] = 0;
  }
}

// Feather edges (pixels adjacent to transparent background that are very dark)
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const idx = y * width + x;
    if (!visited[idx]) {
      // Check if neighboring transparent pixel
      const hasTranspNeighbor = (
        visited[idx - 1] || visited[idx + 1] ||
        visited[idx - width] || visited[idx + width]
      );
      if (hasTranspNeighbor) {
        const b = idx * 4;
        const maxVal = Math.max(raw[b], raw[b + 1], raw[b + 2]);
        if (maxVal < 40) {
          raw[b + 3] = Math.round((maxVal / 40) * 255);
        }
      }
    }
  }
}

// Encode back to PNG scanlines (filter type 0: None)
const scanlines = Buffer.alloc(height * (1 + width * 4));
let scanOff = 0;
for (let y = 0; y < height; y++) {
  scanlines[scanOff++] = 0; // Filter 0
  const rowStart = y * width * 4;
  raw.copy(scanlines, scanOff, rowStart, rowStart + width * 4);
  scanOff += width * 4;
}

const compressedIdat = zlib.deflateSync(scanlines, { level: 9 });

// Create IHDR chunk
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // RGBA
ihdr[10] = 0; // deflate
ihdr[11] = 0; // filter method
ihdr[12] = 0; // interlace none

const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdrChunk = makeChunk('IHDR', ihdr);
const idatChunk = makeChunk('IDAT', compressedIdat);
const iendChunk = makeChunk('IEND', Buffer.alloc(0));

const finalPng = Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
fs.writeFileSync(outputPath, finalPng);
console.log('Successfully wrote transparent toy-car.png:', finalPng.length, 'bytes');
