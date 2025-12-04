#!/usr/bin/env node

// Simple PNG Icon Generator without external dependencies
// Creates minimal but valid PNG icons for the Chrome extension

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height, rgba) {
  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdr = createChunk('IHDR', Buffer.concat([
    uint32BE(width),
    uint32BE(height),
    Buffer.from([8, 6, 0, 0, 0]) // 8-bit depth, RGBA, compression, filter, interlace
  ]));

  // Create raw image data with filter bytes
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pixel = getPixelColor(x, y, width, height, rgba);
      rawData[offset++] = pixel[0]; // R
      rawData[offset++] = pixel[1]; // G
      rawData[offset++] = pixel[2]; // B
      rawData[offset++] = pixel[3]; // A
    }
  }

  // Compress data
  const compressed = zlib.deflateSync(rawData, { level: 9 });

  // IDAT chunk
  const idat = createChunk('IDAT', compressed);

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function getPixelColor(x, y, width, height, rgba) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;

  // Calculate distance from center
  const dx = x - centerX;
  const dy = y - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Check if inside rounded rectangle
  const cornerRadius = width * 0.15;
  const inRoundedRect = isInsideRoundedRect(x, y, width, height, cornerRadius);

  if (!inRoundedRect) {
    return [0, 0, 0, 0]; // Transparent
  }

  // Gradient from #667eea (top-left) to #764ba2 (bottom-right)
  const t = (x + y) / (width + height);
  const r1 = 0x66, g1 = 0x7e, b1 = 0xea;
  const r2 = 0x76, g2 = 0x4b, b2 = 0xa2;

  let r = Math.round(r1 + (r2 - r1) * t);
  let g = Math.round(g1 + (g2 - g1) * t);
  let b = Math.round(b1 + (b2 - b1) * t);

  // Add star badge in top-right corner
  const starCenterX = width * 0.78;
  const starCenterY = height * 0.22;
  const starRadius = width * 0.14;

  const starDist = Math.sqrt(Math.pow(x - starCenterX, 2) + Math.pow(y - starCenterY, 2));
  if (starDist < starRadius) {
    // Gold color for star background
    return [0xFF, 0xD7, 0x00, 255];
  }

  // Add "R" letter approximation (simple rectangle shape)
  const letterX = width * 0.25;
  const letterY = height * 0.32;
  const letterW = width * 0.4;
  const letterH = height * 0.45;

  if (x >= letterX && x <= letterX + letterW &&
      y >= letterY && y <= letterY + letterH) {
    // Check if this pixel is part of the "R" shape
    const relX = (x - letterX) / letterW;
    const relY = (y - letterY) / letterH;

    // Left vertical bar of R
    if (relX < 0.3) {
      return [255, 255, 255, 255];
    }

    // Top horizontal bar
    if (relY < 0.2 && relX < 0.9) {
      return [255, 255, 255, 255];
    }

    // Middle horizontal bar
    if (relY > 0.4 && relY < 0.55 && relX < 0.8) {
      return [255, 255, 255, 255];
    }

    // Right curve of R (top half)
    if (relY < 0.5) {
      const curveCenter = { x: 0.7, y: 0.25 };
      const curveDist = Math.sqrt(Math.pow(relX - curveCenter.x, 2) + Math.pow(relY - curveCenter.y, 2));
      if (curveDist > 0.15 && curveDist < 0.35 && relX > 0.5) {
        return [255, 255, 255, 255];
      }
    }

    // Diagonal leg of R
    if (relY > 0.45) {
      const diagX = 0.3 + (relY - 0.45) * 1.2;
      if (Math.abs(relX - diagX) < 0.15) {
        return [255, 255, 255, 255];
      }
    }
  }

  return [r, g, b, 255];
}

function isInsideRoundedRect(x, y, width, height, radius) {
  // Check corners
  if (x < radius && y < radius) {
    return Math.sqrt(Math.pow(x - radius, 2) + Math.pow(y - radius, 2)) <= radius;
  }
  if (x > width - radius && y < radius) {
    return Math.sqrt(Math.pow(x - (width - radius), 2) + Math.pow(y - radius, 2)) <= radius;
  }
  if (x < radius && y > height - radius) {
    return Math.sqrt(Math.pow(x - radius, 2) + Math.pow(y - (height - radius), 2)) <= radius;
  }
  if (x > width - radius && y > height - radius) {
    return Math.sqrt(Math.pow(x - (width - radius), 2) + Math.pow(y - (height - radius), 2)) <= radius;
  }

  return true;
}

function createChunk(type, data) {
  const length = uint32BE(data.length);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function uint32BE(value) {
  const buf = Buffer.alloc(4);
  buf.writeUInt32BE(value, 0);
  return buf;
}

// CRC32 implementation for PNG
function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = getCRC32Table();

  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }

  crc = (crc ^ 0xFFFFFFFF) >>> 0;
  return uint32BE(crc);
}

let crcTable = null;
function getCRC32Table() {
  if (crcTable) return crcTable;

  crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c >>> 0;
  }
  return crcTable;
}

// Generate icons
const iconsDir = path.join(__dirname, 'icons');

const sizes = [16, 48, 128];

sizes.forEach(size => {
  console.log(`Generating ${size}x${size} icon...`);
  const png = createPNG(size, size);
  const filename = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filename, png);
  console.log(`  Saved: ${filename}`);
});

console.log('\nAll icons generated successfully!');
