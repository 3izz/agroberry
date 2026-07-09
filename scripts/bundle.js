// Build-time bundler: concatenates the ES modules into one classic script,
// each wrapped in its own IIFE (real scoping, so same-named internal helpers
// like `render()` in different modules never collide) with an explicit
// exports object, so the site works when opened directly via file:// (no
// <script type="module"> CORS restriction, no fetch() of local JSON files).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JS = path.join(ROOT, 'assets', 'js');

// [relFilePath, varName] — varName is how other modules refer to this module's exports
const FILES = [
  ['data/i18n-data.js', 'I18nData'],
  ['data/media-data.js', 'MediaData'],
  ['modules/i18n.js', 'I18n'],
  ['modules/reveal.js', 'Reveal'],
  ['modules/lightbox.js', 'Lightbox'],
  ['modules/nav.js', 'Nav'],
  ['modules/hero.js', 'Hero'],
  ['modules/services.js', 'Services'],
  ['modules/gallery.js', 'Gallery'],
  ['modules/media-triggers.js', 'MediaTriggers'],
  ['modules/project-filter.js', 'ProjectFilter'],
  ['modules/before-after.js', 'BeforeAfter'],
  ['modules/testimonials.js', 'Testimonials'],
  ['modules/faq.js', 'Faq'],
  ['modules/contact-form.js', 'ContactForm'],
  ['modules/newsletter.js', 'Newsletter'],
  ['main.js', 'Main'],
];

const varByPath = {};
for (const [rel, varName] of FILES) {
  varByPath[rel] = varName;
}

function resolveImportPath(fromRel, importPath) {
  const fromDir = path.posix.dirname(fromRel);
  let resolved = path.posix.normalize(path.posix.join(fromDir, importPath));
  if (resolved.startsWith('..')) resolved = importPath.replace(/^\.\.\//, '');
  return resolved;
}

function transform(rel, source) {
  const importRe = /^import\s*\{([^}]+)\}\s*from\s*['"](.+?)['"];?\s*$/gm;
  const localToModuleVar = {};

  source = source.replace(importRe, (match, names, importPath) => {
    const resolvedRel = resolveImportPath(rel, importPath);
    const moduleVar = varByPath[resolvedRel];
    if (!moduleVar) {
      throw new Error(`Bundler: could not resolve import "${importPath}" from ${rel} (resolved: ${resolvedRel})`);
    }
    names.split(',').forEach((n) => {
      const name = n.trim();
      if (name) localToModuleVar[name] = moduleVar;
    });
    return ''; // dropped; replaced by destructure line below
  });

  const destructureNames = Object.keys(localToModuleVar);
  let destructureLines = '';
  if (destructureNames.length) {
    // group by module var so `const { a, b } = ModuleVar;`
    const grouped = {};
    destructureNames.forEach((name) => {
      const mv = localToModuleVar[name];
      grouped[mv] = grouped[mv] || [];
      grouped[mv].push(name);
    });
    destructureLines = Object.entries(grouped)
      .map(([mv, names]) => `  const { ${names.join(', ')} } = ${mv};`)
      .join('\n');
  }

  const exported = [];
  source = source
    .replace(/^export\s+async\s+function\s+(\w+)/gm, (m, name) => {
      exported.push(name);
      return `async function ${name}`;
    })
    .replace(/^export\s+function\s+(\w+)/gm, (m, name) => {
      exported.push(name);
      return `function ${name}`;
    })
    .replace(/^export\s+(const|let|var)\s+(\w+)/gm, (m, kind, name) => {
      exported.push(name);
      return `${kind} ${name}`;
    });

  return { body: source.trim(), destructureLines, exported };
}

let out = [
  '/* AgroBerry — bundled script (auto-generated from assets/js/*.js).',
  '   Do not edit directly; edit the source modules and re-run `node scripts/bundle.js`. */',
];

for (const [rel, varName] of FILES) {
  const full = path.join(JS, rel);
  const src = fs.readFileSync(full, 'utf8');
  const { body, destructureLines, exported } = transform(rel, src);

  out.push(`\nconst ${varName} = (function () {`);
  out.push("'use strict';");
  if (destructureLines) out.push(destructureLines);
  out.push(body);
  if (exported.length) {
    out.push(`return { ${exported.join(', ')} };`);
  } else {
    out.push('return {};');
  }
  out.push('})();');
}

fs.writeFileSync(path.join(JS, 'bundle.js'), out.join('\n') + '\n');
console.log('Wrote assets/js/bundle.js —', out.join('\n').length, 'bytes');
