import fs from "fs";
import path from "path";
import zlib from "zlib";

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, r, g, b) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk("IHDR", ihdr);

  // Scanlines with subtle gradient
  const rowLen = 1 + width * 3;
  const raw = Buffer.alloc(height * rowLen);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    raw[rowOffset] = 0; // filter None
    const factor = 0.6 + 0.4 * (y / height);
    const cr = Math.min(255, Math.floor(r * factor));
    const cg = Math.min(255, Math.floor(g * factor));
    const cb = Math.min(255, Math.floor(b * factor));
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      // Add a border effect
      if (x < 10 || x > width - 10 || y < 10 || y > height - 10) {
        raw[pxOffset] = 100;
        raw[pxOffset + 1] = 160;
        raw[pxOffset + 2] = 255;
      } else {
        raw[pxOffset] = cr;
        raw[pxOffset + 1] = cg;
        raw[pxOffset + 2] = cb;
      }
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idatChunk = makeChunk("IDAT", compressed);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const screens = [
  { name: "home.png", r: 10, g: 30, b: 70 },
  { name: "brief.png", r: 20, g: 45, b: 90 },
  { name: "builder.png", r: 15, g: 35, b: 80 },
  { name: "route.png", r: 25, g: 40, b: 85 },
  { name: "launch.png", r: 35, g: 25, b: 75 },
  { name: "hazard.png", r: 60, g: 30, b: 50 },
  { name: "landing.png", r: 40, g: 50, b: 60 },
  { name: "report.png", r: 15, g: 55, b: 70 },
  { name: "data-sources.png", r: 10, g: 45, b: 95 },
];

const outDir = path.resolve("screenshots");
for (const s of screens) {
  const buf = createPng(1280, 720, s.r, s.g, s.b);
  fs.writeFileSync(path.join(outDir, s.name), buf);
  console.log(`Generated screenshots/${s.name} (1280x720, ${buf.length} bytes)`);
}
