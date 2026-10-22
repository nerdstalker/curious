#!/usr/bin/env node
// Builds the Chrome Web Store upload (dist/curious-chrome-<version>.zip) from
// prototypes/compact-window/extension and validates the manifest first.
// Usage: node scripts/build-chrome-zip.mjs
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'prototypes/compact-window/extension');
const dist = path.join(root, 'dist');

// Only these files ship. Anything else in the folder (notes, test copies, .DS_Store) is left out.
const SHIP = ['manifest.json', 'background.js', 'card.js', 'wikipedia.js', 'settings.html', 'settings.js',
  ...['off', 'on'].flatMap(s => [16, 32, 48, 128].map(n => `icons/${s}-${n}.png`))];
const PERMISSIONS = ['activeTab', 'scripting', 'storage', 'search'];
const HOSTS = ['https://en.wikipedia.org/*'];

const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };

const manifest = JSON.parse(fs.readFileSync(path.join(src, 'manifest.json'), 'utf8'));

// Test runs add local hosts (127.0.0.1, localhost) to the manifest; never ship them.
const hosts = (manifest.host_permissions || []).filter(h => !/^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])([:/]|$)/.test(h));
if (hosts.length !== (manifest.host_permissions || []).length) console.log('Removed test host permissions:', manifest.host_permissions.filter(h => !hosts.includes(h)).join(', '));
manifest.host_permissions = hosts;

check(manifest.manifest_version === 3, 'manifest_version must be 3');
check(manifest.name === 'Curious', `name must be "Curious" (found "${manifest.name}")`);
check(/^\d+(\.\d+){0,3}$/.test(manifest.version) && manifest.version.split('.').every(n => +n <= 65535), `version "${manifest.version}" is not a valid Chrome version`);
check(typeof manifest.description === 'string' && manifest.description.length > 0 && manifest.description.length <= 132, 'description must be 1 to 132 characters');
check(JSON.stringify([...manifest.permissions].sort()) === JSON.stringify([...PERMISSIONS].sort()), `permissions must be exactly ${PERMISSIONS.join(', ')} (found ${manifest.permissions.join(', ')})`);
check(JSON.stringify(hosts) === JSON.stringify(HOSTS), `host_permissions must be exactly ${HOSTS.join(', ')} (found ${hosts.join(', ')})`);
check(!manifest.content_scripts && !manifest.optional_permissions && !manifest.optional_host_permissions && !manifest.externally_connectable && !manifest.web_accessible_resources, 'unexpected content_scripts, optional permissions, externally_connectable or web_accessible_resources');
check(manifest.background?.service_worker === 'background.js', 'background.service_worker must be background.js');
check(manifest.options_ui?.page === 'settings.html', 'options_ui.page must be settings.html');
check(manifest.icons?.['128'], 'a 128px icon is required by the store');
for (const p of [...Object.values(manifest.icons || {}), ...Object.values(manifest.action?.default_icon || {}), manifest.background?.service_worker, manifest.options_ui?.page])
  check(SHIP.includes(p) && fs.existsSync(path.join(src, p)), `manifest references ${p}, which is missing or not shipped`);
for (const f of SHIP) check(fs.existsSync(path.join(src, f)), `missing ${f}`);

// card.js is kept byte-identical across the demo and both extension packages.
for (const copy of ['prototypes/compact-window/card.js', 'prototypes/compact-window/safari-extension/card.js'])
  check(fs.readFileSync(path.join(root, copy)).equals(fs.readFileSync(path.join(src, 'card.js'))), `${copy} differs from extension/card.js`);

// Product wording: no working name, no prototype language, no remote code.
for (const f of SHIP.filter(f => /\.(js|html|json)$/.test(f))) {
  const text = f === 'manifest.json' ? JSON.stringify(manifest) : fs.readFileSync(path.join(src, f), 'utf8');
  check(!/apture/i.test(text), `${f} mentions Apture`);
  check(!/prototype/i.test(text), `${f} contains prototype wording`);
  check(!/<script[^>]+src=["']https?:|import\(\s*["']https?:|importScripts\(\s*["']https?:|\beval\(/.test(text), `${f} loads remote or evaluated code`);
}
for (const f of ['background.js', 'card.js', 'wikipedia.js', 'settings.js']) {
  try { execFileSync(process.execPath, ['--check', path.join(src, f)], {stdio: 'pipe'}); }
  catch (e) { errors.push(`${f} has a syntax error: ${e.stderr}`); }
}

if (errors.length) { console.error('Manifest validation failed:\n- ' + errors.join('\n- ')); process.exit(1); }

const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'curious-chrome-'));
try {
  for (const f of SHIP) { fs.mkdirSync(path.dirname(path.join(stage, f)), {recursive: true}); fs.copyFileSync(path.join(src, f), path.join(stage, f)); }
  fs.writeFileSync(path.join(stage, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  fs.mkdirSync(dist, {recursive: true});
  const out = path.join(dist, `curious-chrome-${manifest.version}.zip`);
  fs.rmSync(out, {force: true});
  // -X drops macOS extended attributes; -D leaves out directory entries.
  execFileSync('zip', ['-q', '-r', '-X', '-D', out, ...SHIP], {cwd: stage});
  const listed = execFileSync('unzip', ['-Z1', out], {encoding: 'utf8'}).trim().split('\n').sort();
  if (JSON.stringify(listed) !== JSON.stringify([...SHIP].sort())) { console.error('Zip contents do not match the ship list:', listed); process.exit(1); }
  console.log(`Built ${path.relative(root, out)} (${fs.statSync(out).size} bytes, ${listed.length} files). Curious ${manifest.version}, permissions: ${manifest.permissions.join(', ')}; host: ${hosts.join(', ')}.`);
} finally { fs.rmSync(stage, {recursive: true, force: true}); }
