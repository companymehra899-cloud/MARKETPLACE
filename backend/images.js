const sharp = require('sharp');

const MAX_SHOTS = 2;
const MAX_SHOT_CHARS = 220000;
const MAX_EDGE = 1280;
const WEBP_QUALITY = 80;

const DATA_URL_RE = /^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/;

async function toWebpDataUrl(dataUrl) {
  const match = DATA_URL_RE.exec(dataUrl);
  if (!match) return null;
  const input = Buffer.from(match[1], 'base64');
  if (!input.length) return null;
  const output = await sharp(input)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  return `data:image/webp;base64,${output.toString('base64')}`;
}

async function prepareScreenshots(list) {
  if (!Array.isArray(list)) return [];
  const prepared = [];
  for (const raw of list) {
    if (typeof raw !== 'string') continue;
    const value = raw.trim();
    if (/^https?:\/\//.test(value)) {
      prepared.push(value);
      continue;
    }
    if (DATA_URL_RE.test(value)) {
      try {
        const webp = await toWebpDataUrl(value);
        prepared.push(webp || value);
      } catch (err) {
        console.error('Screenshot compression failed:', err.message);
        prepared.push(value);
      }
    }
  }
  return prepared.filter((s) => s.length <= MAX_SHOT_CHARS).slice(0, MAX_SHOTS);
}

module.exports = { prepareScreenshots, MAX_SHOTS, MAX_SHOT_CHARS };
