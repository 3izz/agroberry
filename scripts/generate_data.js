// Regenerates assets/js/data/*.js (embedded, file://-safe data) from the
// canonical source files: locales/en.json, locales/ar.json, data/media.json.
// Run this after editing any of those, then run `node scripts/bundle.js`.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const en = fs.readFileSync(path.join(ROOT, 'locales/en.json'), 'utf8').trim();
const ar = fs.readFileSync(path.join(ROOT, 'locales/ar.json'), 'utf8').trim();
fs.writeFileSync(
  path.join(ROOT, 'assets/js/data/i18n-data.js'),
  `export const en = ${en};\n\nexport const ar = ${ar};\n`
);

const media = fs.readFileSync(path.join(ROOT, 'data/media.json'), 'utf8').trim();
fs.writeFileSync(path.join(ROOT, 'assets/js/data/media-data.js'), `export const mediaData = ${media};\n`);

console.log('Regenerated assets/js/data/i18n-data.js and media-data.js');
console.log('Now run: node scripts/bundle.js');
